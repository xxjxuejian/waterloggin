import * as Cesium from "cesium";

export function useMeasureArea() {
  let handler: Cesium.ScreenSpaceEventHandler | null = null;
  let positions: Cesium.Cartesian3[] = [];
  let pointEntities: Cesium.Entity[] = [];
  let polygonEntity: Cesium.Entity | null = null;
  let areaLabel: Cesium.Entity | null = null;
  let floatingPoint: Cesium.Entity | null = null;
  let movingPosition: Cesium.Cartesian3 | null = null;

  const startMeasureArea = (viewer: Cesium.Viewer) => {
    cleanup(viewer);
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // 鼠标点击添加点
    handler.setInputAction((click) => {
      const cartesian = viewer.scene.pickPosition(click.position);
      if (!cartesian) return;

      positions.push(cartesian);

      const point = viewer.entities.add({
        position: cartesian,
        point: {
          pixelSize: 10,
          color: Cesium.Color.SKYBLUE,
        },
      });
      pointEntities.push(point);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 鼠标移动显示预览面
    handler.setInputAction((movement) => {
      if (positions.length < 2) return;
      const cartesian = viewer.scene.pickPosition(movement.endPosition);
      if (!cartesian) return;

      movingPosition = cartesian;

      if (!floatingPoint) {
        floatingPoint = viewer.entities.add({
          position: cartesian,
          point: {
            pixelSize: 8,
            color: Cesium.Color.YELLOW,
          },
        });
      } else {
        floatingPoint.position = cartesian;
      }

      //   const dynamicPositions = new Cesium.CallbackProperty(() => {
      //     // return [...positions, cartesian];
      //     if (!positions || positions.length < 2 || !cartesian) return [];
      //     return [...positions, cartesian];
      //   }, false);

      //   if (!polygonEntity) {
      //     polygonEntity = viewer.entities.add({
      //       polygon: {
      //         hierarchy: dynamicPositions,
      //         material: Cesium.Color.YELLOW.withAlpha(0.4),
      //         outline: true,
      //         outlineColor: Cesium.Color.BLACK,
      //       },
      //     });
      //   } else {
      //     (polygonEntity.polygon!.hierarchy as Cesium.CallbackProperty).setValue(() => [
      //       ...positions,
      //       cartesian,
      //     ]);
      //   }

      if (!polygonEntity) {
        polygonEntity = viewer.entities.add({
          polygon: {
            hierarchy: new Cesium.CallbackProperty(() => {
              return movingPosition ? [...positions, movingPosition] : positions;
            }, false),
            material: Cesium.Color.YELLOW.withAlpha(0.4),
            outline: true,
            outlineColor: Cesium.Color.BLACK,
          },
        });
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 右键完成绘制
    handler.setInputAction(() => {
      console.log("鼠标右键");
      if (positions.length < 3) return;
      completeMeasure(viewer);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  };

  const completeMeasure = (viewer: Cesium.Viewer) => {
    handler?.destroy();
    handler = null;

    if (floatingPoint) {
      viewer.entities.remove(floatingPoint);
      floatingPoint = null;
    }

    movingPosition = null;

    // 简单平面面积计算（使用地球坐标粗略计算）
    const area = computeArea(positions);
    const center = getPolygonCenter(positions);

    areaLabel = viewer.entities.add({
      position: center,
      label: {
        text: formatArea(area),
        font: "14px sans-serif",
        fillColor: Cesium.Color.RED,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -10),
      },
    });
  };

  const cleanup = (viewer: Cesium.Viewer) => {
    positions = [];
    movingPosition = null;

    pointEntities.forEach((e) => viewer.entities.remove(e));
    pointEntities = [];

    if (polygonEntity) {
      viewer.entities.remove(polygonEntity);
      polygonEntity = null;
    }

    if (areaLabel) {
      viewer.entities.remove(areaLabel);
      areaLabel = null;
    }

    if (floatingPoint) {
      viewer.entities.remove(floatingPoint);
      floatingPoint = null;
    }

    handler?.destroy();
    handler = null;
  };

  return {
    startMeasureArea,
    cleanup,
  };
}

// --- 工具函数：简单面积计算 ---
function computeArea(positions: Cesium.Cartesian3[]): number {
  const cartographics = positions.map((pos) => {
    return Cesium.Cartographic.fromCartesian(pos);
  });
  const coordinates = cartographics.map((c) => {
    return [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude)];
  });

  let area = 0;
  for (let i = 0; i < coordinates.length; i++) {
    const [x1, y1] = coordinates[i];
    const [x2, y2] = coordinates[(i + 1) % coordinates.length];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area * 0.5) * 111319.9 * 111319.9; // 粗略转换为平方米（WGS84近似值）
}

function getPolygonCenter(positions: Cesium.Cartesian3[]): Cesium.Cartesian3 {
  const center = positions.reduce(
    (acc, p) => Cesium.Cartesian3.add(acc, p, new Cesium.Cartesian3()),
    new Cesium.Cartesian3(0, 0, 0)
  );
  return Cesium.Cartesian3.multiplyByScalar(center, 1 / positions.length, new Cesium.Cartesian3());
}

function formatArea(area: number): string {
  return area > 1000000 ? (area / 1e6).toFixed(2) + " km²" : area.toFixed(2) + " m²";
}
