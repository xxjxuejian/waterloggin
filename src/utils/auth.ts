// 设置token,获取token等
const TOKEN_INFO_KEY = "tokenInfo";
const TOKEN_VALID_TIME = 1000 * 60 * 60 * 2; // 2小时

// 设置token
export const setToken = (token: string) => {
  const tokenInfo = {
    token,
    timestamp: Date.now(), // 记录获取token的时间戳
  };
  localStorage.setItem(TOKEN_INFO_KEY, JSON.stringify(tokenInfo));
};

// 获取token
export const getToken = () => {
  const tokenInfoStr = localStorage.getItem(TOKEN_INFO_KEY);
  if (!tokenInfoStr) return null;

  try {
    const tokenInfo = JSON.parse(tokenInfoStr);
    return tokenInfo.token;
  } catch (err) {
    console.error("获取token失败:", err);
    return null;
  }
};

// 检查token是否过期
export const isTokenExpired = () => {
  // 获取不到token，就认为是过期了
  const tokenInfoStr = localStorage.getItem(TOKEN_INFO_KEY);
  if (!tokenInfoStr) return true;

  try {
    const tokenInfo = JSON.parse(tokenInfoStr);
    const currentTime = Date.now();
    const tokenTime = tokenInfo.timestamp;

    // 间隔大于有效期，就是过期了
    return currentTime - tokenTime > TOKEN_VALID_TIME;
  } catch (err) {
    console.error("检查token是否过期失败:", err);
    return true;
  }
};

// 删除token
export const clearToken = () => {
  localStorage.removeItem(TOKEN_INFO_KEY);
};

// 获取完整 tokenInfo 的方法
export const getTokenInfo = () => {
  const str = localStorage.getItem(TOKEN_INFO_KEY);
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch (err) {
    console.error("获取tokenInfo失败:", err);
    return null;
  }
};

// interface TokenInfo {
//   token: string;
//   timestamp: number;
// }
