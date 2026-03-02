export async function authFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status === 401 || response.status === 403) {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                localStorage.clear();
                throw new Error("Không có refresh token");
            }

            const refreshResp = await fetch(
                "http://localhost:8080/tai-khoan/refresh-token",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        refreshToken: refreshToken,
                    }),
                }
            );

            if (!refreshResp.ok) {
                localStorage.clear();
                throw new Error("Phiên đăng nhập hết hạn");
            }

            const data = await refreshResp.json();
            localStorage.setItem("accessToken", data.accessToken);

            // gọi lại API ban đầu
            return authFetch(url, options);
        }

        return response;
    } catch (err) {
        throw err;
    }
}
