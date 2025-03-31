import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Report = () => {
    const [bookStats, setBookStats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Mặc định tháng hiện tại
    const [year, setYear] = useState(new Date().getFullYear()); // Mặc định năm hiện tại
    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Số lượng mục mỗi trang

    useEffect(() => {
        fetchBookStats();
    }, [month, year]); // Gọi lại khi month hoặc year thay đổi

    const fetchBookStats = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/getBookBorrowByMonth', {
                params: { month, year }
            });
            setBookStats(response.data.data || []); // Đảm bảo bookStats không bị undefined
            setCurrentPage(1); // Reset về trang đầu khi dữ liệu thay đổi
        } catch (error) {
            console.error('Lỗi khi lấy thống kê sách:', error);
            setBookStats([]); // Reset dữ liệu nếu có lỗi
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = async () => {
        try {
            setLoading(true);
            const response = await axios({
                url: 'http://localhost:5000/api/exportBookBorrow',
                method: 'GET',
                responseType: 'blob',
                params: { month, year }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Bao_cao_sach_${month}_${year}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Lỗi khi xuất Excel:', error);
        } finally {
            setLoading(false);
        }
    };

    // Dữ liệu cho biểu đồ Top 3 sách mượn nhiều nhất
    const getMostChartData = () => {
        if (bookStats.length === 0) return {};

        const top3MostBorrowed = bookStats.slice(0, 3);
        return {
            labels: top3MostBorrowed.map(book => book.tensach),
            datasets: [
                {
                    label: 'Số lượt mượn',
                    data: top3MostBorrowed.map(book => book.tongluotmuon),
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    borderRadius: 5,
                    barThickness: 40,
                },
            ],
        };
    };

    // Dữ liệu cho biểu đồ Top 3 sách mượn ít nhất
    const getLeastChartData = () => {
        if (bookStats.length === 0) return {};

        const top3LeastBorrowed = bookStats.slice(-3).reverse();
        return {
            labels: top3LeastBorrowed.map(book => book.tensach),
            datasets: [
                {
                    label: 'Số lượt mượn',
                    data: top3LeastBorrowed.map(book => book.tongluotmuon),
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    borderRadius: 5,
                    barThickness: 40,
                },
            ],
        };
    };

    // Cấu hình chung cho biểu đồ
    const chartOptions = (title, maxBorrowCount) => {
        const maxY = Math.max(maxBorrowCount, 5);
        const stepSize = maxBorrowCount > 5 ? 5 : 1;

        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: {
                    display: true,
                    text: title,
                    font: { size: 16, weight: 'bold' },
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.label}: ${context.raw} lượt mượn`,
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: maxY,
                    title: { display: true, text: 'Số lượt mượn' },
                    ticks: { stepSize, callback: (value) => Number.isInteger(value) ? value : null },
                },
                x: {
                    title: { display: true, text: 'Tên sách' },
                },
            },
            animation: { duration: 1500, easing: 'easeOutQuart' },
        };
    };

    const getMaxBorrowCount = (dataFunc) => {
        const data = dataFunc();
        if (!data.datasets || data.datasets.length === 0) return 5;
        return Math.max(...data.datasets[0].data);
    };

    // Tính toán dữ liệu hiển thị cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = bookStats.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(bookStats.length / itemsPerPage);

    // Hàm chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container py-4">
            <div className="card shadow-sm" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                <div className="card-header bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Báo Cáo Thống Kê Sách - Tháng {month}/{year}</h4>
                        <div className="d-flex align-items-center">
                            <select
                                className="form-select me-2"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                style={{ width: 'auto' }}
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        Tháng {i + 1}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="form-select me-2"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                style={{ width: 'auto' }}
                            >
                                {Array.from({ length: 10 }, (_, i) => (
                                    <option key={i} value={new Date().getFullYear() - i}>
                                        {new Date().getFullYear() - i}
                                    </option>
                                ))}
                            </select>
                            <button
                                className="btn btn-light btn-sm"
                                onClick={handleExportExcel}
                                disabled={loading}
                            >
                                <i className="bi bi-download me-2"></i>
                                {loading ? 'Đang xuất...' : 'Xuất Excel'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Đang tải...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {bookStats.length >= 3 && (
                                <div className="row mb-5">
                                    <div className="col-md-6">
                                        <div className="chart-container" style={{ height: '300px', padding: '15px' }}>
                                            <Bar
                                                data={getMostChartData()}
                                                options={chartOptions('Top 3 sách mượn nhiều nhất', getMaxBorrowCount(getMostChartData))}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="chart-container" style={{ height: '300px', padding: '15px' }}>
                                            <Bar
                                                data={getLeastChartData()}
                                                options={chartOptions('Top 3 sách mượn ít nhất', getMaxBorrowCount(getLeastChartData))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="table-responsive">
                                <table className="table table-hover table-striped">
                                    <thead className="table-dark">
                                    <tr>
                                        <th scope="col">Mã sách</th>
                                        <th scope="col">Tên sách</th>
                                        <th scope="col">Mã vị trí</th>
                                        <th scope="col">Cơ sở</th>
                                        <th scope="col">Số kệ</th>
                                        <th scope="col">Số lượt mượn</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map((book) => (
                                            <tr key={`${book.masach}-${book.mavitri}`}>
                                                <td>{book.masach}</td>
                                                <td>{book.tensach}</td>
                                                <td>{book.mavitri}</td>
                                                <td>{book.coso}</td>
                                                <td>{book.soke}</td>
                                                <td>{book.tongluotmuon}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">
                                                Không có dữ liệu để hiển thị
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {bookStats.length > 0 && (
                                <nav aria-label="Page navigation">
                                    <ul className="pagination justify-content-center mt-3">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                Trước
                                            </button>
                                        </li>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <li
                                                key={page}
                                                className={`page-item ${currentPage === page ? 'active' : ''}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                                Sau
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </>
                    )}
                </div>

                <div className="card-footer text-muted">
                    Cập nhật: {new Date().toLocaleString('vi-VN')}
                </div>
            </div>

            <style jsx>{`
                .table th, .table td {
                    vertical-align: middle;
                }
                .table-hover tbody tr:hover {
                    background-color: #f8f9fa;
                }
                .chart-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            `}</style>
        </div>
    );
};

export default Report;