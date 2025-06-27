// 大屏左上角的下沉隧道监测
import request from "@/utils/request";

// 获取下沉隧道的状态统计
export function getTunnelStatusApi() {
  return request({
    url: "/tunnel/statusCount",
    method: "get",
  });
}

// 获取指定类型的站点列表
export function getStationListByTypeApi(data = {}) {
  return request({
    url: "/station/list",
    method: "post",
    data: {
      typeId: data.typeId,
    },
  });
}
