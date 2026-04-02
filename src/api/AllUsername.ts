import { authFetch } from "./authFetch";

export async function getAllUsername(): Promise<string[]> {
	const response = await authFetch("http://localhost:8080/tai-khoan/all-username", {
		method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,   
        }
	});
	if (!response.ok) {
		throw new Error("Không thể lấy danh sách username");
	}
	const data = await response.json();
	return data as string[];
}