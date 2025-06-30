// 设置token,获取token等
const TOKEN_INFO_KEY = "tokenInfo";
const TOKEN_VALID_TIME = 1000 * 60 * 60 * 2; // 2小时

// 保存tokenInfo
export const setToken = (token: string) => {
  const tokenInfo: TokenInfo = {
    token,
    timestamp: Date.now(), // 记录获取token的时间戳
  };

  localStorage.setItem(TOKEN_INFO_KEY, JSON.stringify(tokenInfo));
};

// 获取完整 tokenInfo 的方法
export const getTokenInfo = (): TokenInfo | null => {
  const str = localStorage.getItem(TOKEN_INFO_KEY);
  if (!str) return null;
  try {
    const data = JSON.parse(str);

    return isValidTokenInfo(data) ? data : null;
  } catch (err) {
    console.error("获取tokenInfo失败:", err);
    return null;
  }
};

// 获取token
export const getToken = (): string | null => {
  const tokenInfo = getTokenInfo();
  return tokenInfo?.token || null;
};

// 检查token是否过期
export const isTokenExpired = (): boolean => {
  // 获取不到token，就认为是过期了
  const tokenInfo = getTokenInfo();
  if (!tokenInfo) return true;

  return Date.now() - tokenInfo.timestamp > TOKEN_VALID_TIME;
};

// 删除token
export const clearToken = () => {
  localStorage.removeItem(TOKEN_INFO_KEY);
};

interface TokenInfo {
  token: string;
  timestamp: number;
}

// 类型守卫（防御性编程）
function isValidTokenInfo(obj: any): obj is TokenInfo {
  return obj && typeof obj.token === "string" && typeof obj.timestamp === "number";
}
