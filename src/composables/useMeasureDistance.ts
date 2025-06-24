// src/composables/useMeasureDistance.ts
import * as Cesium from "cesium";

export function useMeasureDistance() {
  let handler: Cesium.ScreenSpaceEventHandler | null = null;
  let positions: Cesium.Cartesian3[] = []; //保存所有的三维坐标点
  let lineEntity: Cesium.Entity | null = null; // 唯一，目的？
  let pointEntities: Cesium.Entity[] = []; // 保存生成的所有点实体 ，为了后面方便删除
  let segmentLabels: Cesium.Entity[] = []; // 保存所有的线段实体，为了后面方便删除
  let totalLabel: Cesium.Entity | null = null; // 总距离标记
  let totalDistance = 0; // 总的测量距离

  let previewLineEntity: Cesium.Entity | null = null;
  let movingPosition: Cesium.Cartesian3 | null = null;

  // 开始测量
  const startMeasureDistance = (viewer: Cesium.Viewer) => {
    cleanup(viewer); // 清除之前的测量状态

    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // 添加左键单击事件
    handler.setInputAction((click) => {
      const cartesian = viewer.scene.pickPosition(click.position);
      if (!cartesian) return;

      positions.push(cartesian);

      // 添加点
      const point = viewer.entities.add({
        position: cartesian,
        point: {
          pixelSize: 10,
          color: Cesium.Color.RED,
        },
      });
      pointEntities.push(point);

      const len = positions.length;
      if (len >= 2) {
        const p1 = positions[len - 2];
        const p2 = positions[len - 1];

        const segmentLen = Cesium.Cartesian3.distance(p1, p2);
        totalDistance += segmentLen;

        // 添加段距离标签
        const mid = Cesium.Cartesian3.midpoint(p1, p2, new Cesium.Cartesian3());
        const label = viewer.entities.add({
          position: mid,
          label: {
            text: (segmentLen / 1000).toFixed(2) + " km",
            font: "14px sans-serif",
            fillColor: Cesium.Color.BLUE,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          },
        });
        segmentLabels.push(label);

        // 第一次连线时创建 entity
        if (!lineEntity) {
          lineEntity = viewer.entities.add({
            polyline: {
              positions: new Cesium.CallbackProperty(() => positions, false),
              width: 3,
              material: Cesium.Color.YELLOW,
              clampToGround: false,
            },
          });
        }
      }

      // 每次点击后清除鼠标预览线段的终点
      movingPosition = null;
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 添加 mousemove 监听
    // 鼠标移动预览下一段线
    handler.setInputAction((movement) => {
      if (positions.length === 0) return;

      const pos = viewer.scene.pickPosition(movement.endPosition);
      if (!pos) return;

      movingPosition = pos;

      if (!previewLineEntity) {
        previewLineEntity = viewer.entities.add({
          polyline: {
            positions: new Cesium.CallbackProperty(() => {
              return movingPosition ? [positions[positions.length - 1], movingPosition] : [];
            }, false),
            width: 2,
            material: new Cesium.PolylineDashMaterialProperty({
              color: Cesium.Color.AQUA,
            }),
            clampToGround: false,
          },
        });
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 添加右键单击/左键双击  结束
    // 左键双击的时候，是不是会触发一次左键的单击事件
    handler.setInputAction(() => {
      if (positions.length >= 2) {
        const last = positions[positions.length - 1];
        totalLabel = viewer.entities.add({
          position: last,
          label: {
            text: "总长度：" + (totalDistance / 1000).toFixed(2) + " km",
            font: "16px sans-serif",
            fillColor: Cesium.Color.GREEN,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -20),
          },
        });
      }
      stop(viewer);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  };

  // 停止交互
  const stop = (viewer: Cesium.Viewer) => {
    handler?.destroy();
    handler = null;
    if (previewLineEntity) {
      viewer.entities.remove(previewLineEntity);
      previewLineEntity = null;
    }
    movingPosition = null;
  };

  // 清除测量
  const cleanup = (viewer: Cesium.Viewer) => {
    positions = [];
    totalDistance = 0;

    if (lineEntity) {
      viewer.entities.remove(lineEntity);
      lineEntity = null;
    }
    if (totalLabel) {
      viewer.entities.remove(totalLabel);
      totalLabel = null;
    }
    if (previewLineEntity) {
      viewer.entities.remove(previewLineEntity);
      previewLineEntity = null;
    }

    pointEntities.forEach((p) => viewer.entities.remove(p));
    segmentLabels.forEach((l) => viewer.entities.remove(l));

    pointEntities = [];
    segmentLabels = [];

    stop(viewer);
  };

  return {
    startMeasureDistance,
    cleanup,
    stop,
  };
}
