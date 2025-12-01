/**
 * Nội dung yêu cầu đề bài cho MOS Word (trích từ file đính kèm và yêu cầu mới).
 * Nội dung này được mã hóa (encodeURIComponent) để truyền qua tham số URL.
 */
const MOS_WORD_REQUEST = encodeURIComponent(`
    <h3>Yêu Cầu Bài Làm (Tổng điểm: 1000)</h3>
    <ol>
        <li>Đổi lề trang của toàn bộ tài liệu: 
            <ul>
                <li>Lề trên và dưới 0.75” (1.9 cm)</li>
                <li>Lề trái và phải 0.5” (1.27 cm)</li>
            </ul>
        </li>
        <li>Ngắt trang kiểu **Next Page** vào trước tiêu đề “About IIG Academy”</li>
        <li>Thay đổi hướng (orientation) của **duy nhất trang 2** thành hướng ngang (landscape). 
            (Chú ý: Không cần đặt lại lề trong yêu cầu này)
        </li>
        <li>Trong phần thuộc tính (properties) của tệp:
            <ul>
                <li>Thêm “IIG Academy” vào danh mục (category)</li>
                <li>Và “MOS Word 2019” vào tiêu đề (title).</li>
            </ul>
        </li>
        <li>Áp dụng chủ đề (Theme) **Berlin** vào tài liệu. 
            <br>Sau đó áp dụng hiệu ứng văn bản (Text Effect) kiểu **Fill: Orange, Accent Color 1; Shadow** cho cụm từ “Educational Testing Service”.
        </li>
        <li style="font-weight: bold; color: #d9534f; margin-top: 20px;">Lưu và chấm điểm:
            <ul style="font-weight: normal; color: #333;">
                <li>Lưu bài với cấu trúc "**Ten_NgaySinh_ProjectA.docx**" và đường dẫn: "**C:\\Word\\**" </li>
                <li>Mở file chấm điểm <a href="MOS_FILES/Word/MOS_Word2019_Project_A_ChamDiem.docm" style="color: #007bff; text-decoration: underline;">Kết quả</a> và chạy **Macro** có tên **ChamDiem** để tạo kết quả ở "**C:\\WordResult\\**"</li>
            </ul>
        </li>
    </ol>
`);

/**
 * Nội dung thông báo chung cho Excel và PowerPoint.
 */
const MOS_GENERAL_NOTICE = (software) => encodeURIComponent(`
    <i class="fas fa-exclamation-triangle notice-icon" style="font-size: 3em; color: #ffc107;"></i>
    <h2>Chuẩn Bị Thực Hành MOS ${software}</h2>
    <p>File đề thi đã được tải xuống máy tính của bạn.</p>
`);


/**
 * Hàm xử lý bài thi MOS (Chuyển hướng đến trang thông báo và kích hoạt tải file)
 * @param {string} software - Tên phần mềm (Excel, Word, PowerPoint)
 */
function startMOS(software) {
    const fixedTestNumber = '01';
    
    let fileName = '';
    let fileExtension = '';
    let requestContent = ''; // Nội dung yêu cầu đề bài

    // 1. Xác định tên tệp và nội dung yêu cầu
    if (software === 'Excel') {
        fileName = `MOS_Excel_${fixedTestNumber}`;
        fileExtension = 'xlsm';
        requestContent = MOS_GENERAL_NOTICE('Excel');
    } else if (software === 'Word') {
        fileName = `MOS_Word_${fixedTestNumber}`;
        fileExtension = 'docx';
        requestContent = MOS_WORD_REQUEST; // Sử dụng nội dung đề bài Word đã thêm hướng dẫn chấm điểm
    } else if (software === 'PowerPoint') {
        fileName = `MOS_PowerPoint_${fixedTestNumber}`;
        fileExtension = 'pptx';
        requestContent = MOS_GENERAL_NOTICE('PowerPoint');
    } else {
        alert('Lỗi: Phần mềm MOS không hợp lệ.');
        return;
    }

    // 2. Xây dựng đường dẫn TẢI XUỐNG cố định
    const downloadURL = `MOS_FILES/${software}/${fileName}.${fileExtension}`;

    // 3. Xây dựng URL chuyển hướng đến trang thông báo, kèm theo link tải file VÀ nội dung yêu cầu
    const finalNoticeURL = `mos_notice.html?file=${encodeURIComponent(downloadURL)}&content=${requestContent}`;

    // 4. Chuyển hướng ngay lập tức đến trang thông báo mới
    window.location.href = finalNoticeURL;
}


/**
 * Hàm chọn ngẫu nhiên một bài thi và chuyển hướng cho các môn trắc nghiệm (IC3, GenAI, NLS).
 * Sử dụng cấu trúc thư mục [Môn Học]/[Tên Thư Mục Bài Thi]/index.html
 */
function startTest(subject, level) {
    let basePath = '';
    let folders = [];
    let displayName = '';
    const numTests = 5; // Số lượng bài thi (từ 01 đến 05)

    // --- 1. XÁC ĐỊNH DANH SÁCH THƯ MỤC CÓ THỂ CÓ ---
    
    if (subject === 'gen_ai') {
        basePath = 'GENAI';
        for (let i = 1; i <= numTests; i++) {
            folders.push(`GENAI_${String(i).padStart(2, '0')} (Published)`);
        }
        displayName = 'GENAI (AI TẠO SINH)';

    } else if (subject === 'nang_luc_so') {
        basePath = 'NLS';
        for (let i = 1; i <= numTests; i++) {
            folders.push(`NangLucSo_${String(i).padStart(2, '0')} (Published)`);
        }
        displayName = 'NĂNG LỰC SỐ';

    } else if (subject === 'ic3_gs6' || subject === 'ic3_gs6_spark') {
        if (!level) {
            alert('Lỗi: Cấp độ chưa được xác định cho bài thi này!');
            return;
        }

        const levelName = level.toUpperCase().replace('_', ' ');
        basePath = (subject === 'ic3_gs6') ? 'IC3 GS6' : 'IC3 GS6 Spark';
        
        displayName = `${basePath.toUpperCase()} - ${levelName}`;

        for (let i = 1; i <= numTests; i++) {
            folders.push(`${basePath} ${levelName}_${String(i).padStart(2, '0')} (Published)`);
        }

    } else {
        alert('Lỗi: Môn học không hợp lệ!');
        return;
    }

    // --- 2. CHỌN NGẪU NHIÊN VÀ CHUYỂN HƯỚNG ---
    
    if (folders.length === 0) {
        alert('Lỗi: Không tìm thấy bài thi nào cho môn này. Vui lòng kiểm tra lại tên thư mục.');
        return;
    }

    // Chọn ngẫu nhiên một thư mục trong danh sách folders
    const randomIndex = Math.floor(Math.random() * folders.length);
    const selectedFolder = folders[randomIndex];

    // Đường dẫn cuối cùng: [Base Path]/[Selected Folder]/index.html
    const finalURL = `${basePath}/${selectedFolder}/index.html`;

    // 4. Thông báo và chuyển hướng người dùng
    alert(`Đang mở bài thi thử ${displayName} (Mã bài: ${selectedFolder}). Chúc bạn làm bài tốt!`);
    
    window.location.href = finalURL;

}
