import { LayerType } from "@/enums/cesuim/layer.enum.ts";

export const webKey = "ade57801997980f3af716dc86639979e";

export const viewerConfig = {
  geocoder: false,
  homeButton: false,
  sceneModePicker: false,
  baseLayerPicker: false,
  navigationHelpButton: false,
  animation: false,
  timeline: false,
  fullscreenButton: false,
};

export const cameraConfig = {
  minimumZoomDistance: 100,
  initialHeight: 4000,
};

export const layerConfig = {
  [LayerType.VECTOR]: {
    url: "https://t0.tianditu.gov.cn/vec_w/wmts",
    layer: "vec",
    style: "default",
  },
  [LayerType.IMAGE]: {
    url: "https://t0.tianditu.gov.cn/img_w/wmts",
    layer: "img",
    style: "default",
  },
  [LayerType.VECTOR_LABEL]: {
    url: "https://t0.tianditu.gov.cn/cva_w/wmts",
    layer: "cva",
    style: "default",
  },
  [LayerType.IMAGE_LABEL]: {
    url: "https://t0.tianditu.gov.cn/cia_w/wmts",
    layer: "cia",
    style: "default",
  },
};
