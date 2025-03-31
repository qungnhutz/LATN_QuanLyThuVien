import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import HelpIcon from '@mui/icons-material/Help';

function HomePage() {
    const navigate = useNavigate();
    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseUrl = 'http://localhost:5000';
                const featuredResponse = await fetch(`${baseUrl}/api/GetLatestUpdatedBooks`);
                if (!featuredResponse.ok) throw new Error(`Lỗi khi gọi API Sách Nổi Bật: ${featuredResponse.status}`);
                const featuredData = await featuredResponse.json();
                setFeaturedBooks(featuredData);

                const recommendedResponse = await fetch(`${baseUrl}/api/GetMostBorrowedBooks`);
                if (!recommendedResponse.ok) throw new Error(`Lỗi khi gọi API Sách Đề Xuất: ${recommendedResponse.status}`);
                const recommendedData = await recommendedResponse.json();
                setRecommendedBooks(recommendedData);

                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleViewDetail = (masach) => navigate(`/detailbook/${masach}`);


    return (
        <Container fluid className="px-0">
            {/* Banner */}
            <div className="banner">
                <img src="/banner.jpg" alt="Banner" className="w-100" style={{ maxHeight: '400px', objectFit: 'cover' }} />
            </div>

            {/* Sách Nổi Bật - Slider với nền xanh dương nhạt */}
            <Container
                className="my-5"
                sx={{
                    backgroundColor: 'rgba(135, 206, 235, 0.2)', // Sky blue nhạt
                    padding: '20px',
                    borderRadius: '8px',
                }}
            >
                <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    sx={{
                        backgroundColor: 'rgba(0, 191, 255, 0.8)', // Deep sky blue đậm
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        textAlign: 'center',
                    }}
                >
                    Sách Mới
                </Typography>
                <Slider {...sliderSettings}>
                    {featuredBooks.map((item) => (
                        <div key={item._id} className="px-2">
                            <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden', margin: '0 8px', backgroundColor: '#fff' }}>
                                <CardMedia
                                    component="img"
                                    image={item.img}
                                    alt={item.tensach}
                                    sx={{ height: 250, objectFit: 'contain', backgroundColor: 'rgba(245, 245, 245, 1)' }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="div" gutterBottom>{item.tensach}</Typography>
                                    <Typography variant="body2" color="text.secondary">Mã Sách: {item.masach}</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                                        <Button size="small" color="primary" onClick={() => handleViewDetail(item.masach)}>
                                            Xem Chi Tiết
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </Slider>
            </Container>

            {/* Sách Đề Xuất - Grid với nền xanh nước biển nhạt */}
            <Container
                className="my-5"
                sx={{
                    backgroundColor: 'rgba(173, 216, 230, 0.2)', // Light blue nhạt
                    padding: '20px',
                    borderRadius: '8px',
                }}
            >
                <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    sx={{
                        backgroundColor: 'rgba(70, 130, 180, 0.8)', // Steel blue đậm
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        textAlign: 'center',
                    }}
                >
                    Sách Đề Xuất
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(250px, 1fr))', gap: 3, padding: 2 }}>
                    {recommendedBooks.map((item) => (
                        <Card key={item._id} sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden', backgroundColor: '#fff' }}>
                            <CardMedia
                                component="img"
                                image={item.img}
                                alt={item.tensach}
                                sx={{ height: 250, objectFit: 'contain', backgroundColor: 'rgba(245, 245, 245, 1)' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" component="div" gutterBottom>{item.tensach}</Typography>
                                <Typography variant="body2" color="text.secondary">Mã Sách: {item.masach}</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                                    <Button size="small" color="primary" onClick={() => handleViewDetail(item.masach)}>
                                        Xem Chi Tiết
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Container>

            {/* Hướng Dẫn - Grid với nền xanh đậm nhạt */}
            <Container
                className="my-5"
                sx={{
                    backgroundColor: 'rgba(176, 224, 230, 0.2)', // Powder blue nhạt
                    padding: '20px',
                    borderRadius: '8px',
                }}
            >
                <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    sx={{
                        backgroundColor: 'rgba(25, 25, 112, 0.8)', // Midnight blue đậm
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        textAlign: 'center',
                    }}
                >
                    Hướng Dẫn
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(250px, 1fr))', gap: 3, padding: 2 }}>
                    <Card sx={{ boxShadow: 3, borderRadius: 2, backgroundColor: '#fff' }}>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <InfoIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h6" gutterBottom>Giới Thiệu</Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Thông tin chi tiết về hệ thống
                            </Typography>
                            <Box mt={2}>
                                <Button size="small" color="primary" component={Link} to="/about">
                                    Xem Thêm
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                    <Card sx={{ boxShadow: 3, borderRadius: 2, backgroundColor: '#fff' }}>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ContactMailIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h6" gutterBottom>Liên Hệ</Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Thông tin liên hệ hỗ trợ
                            </Typography>
                            <Box mt={2}>
                                <Button size="small" color="primary" component={Link} to="/contact">
                                    Xem Thêm
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                    <Card sx={{ boxShadow: 3, borderRadius: 2, backgroundColor: '#fff' }}>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <HelpIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h6" gutterBottom>Hướng Dẫn</Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Hướng dẫn sử dụng chi tiết
                            </Typography>
                            <Box mt={2}>
                                <Button size="small" color="primary" component={Link} to="/guide">
                                    Xem Thêm
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </Container>
    );
}

export default HomePage;