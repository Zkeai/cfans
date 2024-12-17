export function hasAuthToken(): boolean {
    // 获取所有 cookies
    const cookies: string = document.cookie || "";

    // 检查是否包含 authjs.session-token
    return cookies.includes("authjs.session-token=");
}