import * as Cesium from "cesium";

export function useMeasureArea() {
  let handler: Cesium.ScreenSpaceEventHandler | null = null;
  let positions: Cesium.Cartesian3[] = [];
  let pointEntities: Cesium.Entity[] = [];
  let previewPolygonEntity: Cesium.Entity | null = null; // 预览多边形、
  let polygonEntity: Cesium.Entity | null = null; // 最终生成的多边形
  let areaLabel: Cesium.Entity | null = null;
  // let floatingPoint: Cesium.Entity | null = null;
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
          color: Cesium.Color.RED,
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

      if (!previewPolygonEntity) {
        previewPolygonEntity = viewer.entities.add({
          polygon: {
            hierarchy: new Cesium.CallbackProperty(() => {
              if (positions.length < 2) return null;
              return new Cesium.PolygonHierarchy([...positions, movingPosition]);
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
      handler?.destroy();
      //  移除浮动预览的多边形（使用 CallbackProperty 的 polygonEntity）
      // 原来的 previewPolygonEntity 是动态变化的（用 CallbackProperty） → 它还会继续尝试访问 movingPosition
      // floatingPoint 为 null 时 → 出现错误（如 DeveloperError: positions is required）
      // 正式多边形必须是固定点
      viewer.entities.remove(previewPolygonEntity);

      // console.log("鼠标右键");
      if (positions.length < 3) return;
      // 3️⃣ 使用固定点创建一个正式的 Polygon 实体
      polygonEntity = viewer.entities.add({
        polygon: {
          hierarchy: positions, // ✅ 只用已点击的点
          material: Cesium.Color.YELLOW.withAlpha(0.4),
          outline: true,
          outlineColor: Cesium.Color.YELLOW,
        },
      });
      completeMeasure(viewer);
      movingPosition = null;
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  };

  const completeMeasure = (viewer: Cesium.Viewer) => {
    // 简单平面面积计算（使用地球坐标粗略计算）
    const area = computeArea(positions);
    const center = getPolygonCenter(positions);

    // 添加面积值文本
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

    if (previewPolygonEntity) {
      viewer.entities.remove(previewPolygonEntity);
      previewPolygonEntity = null;
    }

    if (polygonEntity) {
      viewer.entities.remove(polygonEntity);
      polygonEntity = null;
    }

    if (areaLabel) {
      viewer.entities.remove(areaLabel);
      areaLabel = null;
    }

    // 这里不能destroy,不然再次绘制时会出错，原因是??
    // handler?.destroy();
    handler = null;
  };

  return {
    startMeasureArea,
    cleanup,
  };
}

// --- 工具函数：简单面积计算 ---
// 面积计算函数（球面多边形）
function computeArea(positions: Cesium.Cartesian3[]) {
  // 计算面积
  const cartographics = positions.map((p) => Cesium.Cartographic.fromCartesian(p));

  const ellipsoid = Cesium.Ellipsoid.WGS84;
  let area = 0;

  for (let i = 0; i < cartographics.length; i++) {
    const p1 = cartographics[i];
    const p2 = cartographics[(i + 1) % cartographics.length];

    const λ1 = p1.longitude;
    const φ1 = p1.latitude;
    const λ2 = p2.longitude;
    const φ2 = p2.latitude;

    area += (λ2 - λ1) * (2 + Math.sin(φ1) + Math.sin(φ2));
  }

  area = (area * ellipsoid.maximumRadius * ellipsoid.maximumRadius) / 2.0;
  return Math.abs(area); // m²
}
// 面积计算函数2
// function computeArea(positions: Cesium.Cartesian3[]): number {
//   const cartographics = positions.map((pos) => {
//     return Cesium.Cartographic.fromCartesian(pos);
//   });
//   const coordinates = cartographics.map((c) => {
//     return [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude)];
//   });

//   let area = 0;
//   for (let i = 0; i < coordinates.length; i++) {
//     const [x1, y1] = coordinates[i];
//     const [x2, y2] = coordinates[(i + 1) % coordinates.length];
//     area += x1 * y2 - x2 * y1;
//   }
//   return Math.abs(area * 0.5) * 111319.9 * 111319.9; // 粗略转换为平方米（WGS84近似值）
// }

// 中心点计算函数
function getPolygonCenter(positions: Cesium.Cartesian3[]): Cesium.Cartesian3 {
  const center = positions.reduce(
    (acc, p) => Cesium.Cartesian3.add(acc, p, new Cesium.Cartesian3()),
    new Cesium.Cartesian3(0, 0, 0)
  );
  return Cesium.Cartesian3.multiplyByScalar(center, 1 / positions.length, new Cesium.Cartesian3());
}

// 格式化面积显示
function formatArea(area: number): string {
  return area >= 1000000 ? (area / 1e6).toFixed(2) + " km²" : area.toFixed(2) + " m²";
}
