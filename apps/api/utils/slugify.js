export function createSlug(text) {
    if (!text) return "";

    return text
        .toLowerCase()                  // Chuyển về chữ thường
        .normalize("NFD")                // Phân tách ký tự có dấu thành ký tự không dấu
        .replace(/[\u0300-\u036f]/g, "")  // Loại bỏ các dấu
        .replace(/[^a-z0-9]+/g, "-")     // Thay thế các ký tự không phải chữ cái và số bằng dấu "-"
        .replace(/^-+|-+$/g, "");        // Loại bỏ dấu "-" thừa ở đầu và cuối
}

export default createSlug;