
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
    ChevronDown,
    ChevronUp,
    Star,
    MapPin,
    Users,
    Filter,
    Search,
    List,
    Grid,
    ArrowLeft,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Metadata, Viewport } from 'next';

// --- Helper Components ---

const Header = () => {
    return (
        <header className="bg-white shadow-md py-4">
            <div className="container mx-auto flex items-center justify-between px-4">
                <a href="/" className="text-2xl font-bold text-blue-500">
                    Apollo 247
                </a>
                <nav>
                    <ul className="flex space-x-6">
                        <li><a href="#" className="hover:text-blue-500 transition-colors">Medicine</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">Lab Tests</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">Doctors</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">Health Records</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">My Account</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

const DoctorCard = ({ doctor }: { doctor: any }) => {
    return (
        <Card className="mb-4 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
                    <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                    <CardTitle className="text-lg font-semibold">{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                    <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="mr-1 w-4 h-4" />
                        <span>{doctor.location}, {doctor.hospital}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center mb-2">
                    <Star className="text-yellow-500 mr-1 w-5 h-5" />
                    <span className="font-semibold">{doctor.rating}</span>
                    <span className="text-gray-500 text-sm">({doctor.reviews} reviews)</span>
                </div>
                <div className="flex items-center mb-2">
                    <Users className="mr-1 w-4 h-4" />
                    <span>{doctor.experience} years experience</span>
                </div>
                <div className="flex items-center justify-between">
                    {doctor.available ? (
                        <Badge variant="success">Available</Badge>
                    ) : (
                        <Badge variant="destructive">Unavailable</Badge>
                    )}
                    <span className="font-bold text-lg">₹{doctor.fees}</span>
                </div>
            </CardContent>
        </Card>
    );
};

// --- Main Component ---

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({
        specialty: '',
        location: '',
        availability: undefined, // true, false, undefined
        rating: '',
        sort: '',
    });
    const [showFilters, setShowFilters] = useState(false);
    const pageSize = 10;
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'; // Fallback to a default

    const fetchData = useCallback(async (currentPage: number, currentFilters: any) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                pageSize: pageSize.toString(),
                ...currentFilters,
            } as any); // Type assertion to 'any'

            // Convert availability to string
            if (currentFilters.availability !== undefined) {
                queryParams.set('availability', currentFilters.availability.toString());
            }

            const response = await fetch(`${API_BASE_URL}/api/doctors?${queryParams}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch doctors: ${response.status}`);
            }
            const data = await response.json();
            setDoctors(data.doctors);
            setTotalPages(Math.ceil(data.total / pageSize));
        } catch (error: any) {
            console.error("Failed to fetch doctors:", error);
            // Handle error (e.g., show error message to user)
            alert("Failed to fetch doctors. Please check your network connection and try again."); // Basic error notification
            setDoctors([]); // Clear doctor list on error
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL, pageSize]);

    useEffect(() => {
        fetchData(page, filters);
    }, [fetchData, page, filters]);

    const handleFilterChange = (filterName: keyof typeof filters, value: any) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value,
        }));
        setPage(1); // Reset to first page when filters change
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    // --- Off-Page SEO ---
    const metadata: Metadata = {
        title: "Book an Appointment with General Physician/Internal Medicine Doctors Online | Apollo 247",
        description: "Consult with the best General Physician and Internal Medicine doctors online.  View doctor profiles, fees, specializations, and book appointments.",
        keywords: ["general physician", "internal medicine", "doctors", "online consultation", "appointment", "specialists", "healthcare"],
        openGraph: {
            title: "Book an Appointment with General Physician/Internal Medicine Doctors Online | Apollo 247",
            description: "Consult with the best General Physician and Internal Medicine doctors online.  View doctor profiles, fees, specializations, and book appointments.",
            url: "https://www.apollo247.com/specialties/general-physician-internal-medicine", // Replace with your actual URL
            type: "website",
        },
        robots: {
            index: true,
            follow: true,
            nosnippet: false,
            maxSnippet: -1,
            maxImagePreview: "large",
        };
    };

    const viewport: Viewport = {
        themeColor: '#007bff', // Example theme color
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
    };

    return (
        <>
            {/* SEO Metadata */}
            <head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
                <meta name="keywords" content={metadata.keywords?.join(', ')} />

                {/* Open Graph */}
                <meta property="og:title" content={metadata.openGraph?.title} />
                <meta property="og:description" content={metadata.openGraph?.description} />
                <meta property="og:url" content={metadata.openGraph?.url} />
                <meta property="og:type" content={metadata.openGraph?.type} />

                {/* Robots */}
                <meta name="robots" content={metadata.robots?.index ? 'index' : 'noindex'} />
                <meta name="robots" content={metadata.robots?.follow ? 'follow' : 'nofollow'} />
                <meta name="robots" content={metadata.robots?.nosnippet ? 'nosnippet' : 'snippet'} />
                <meta name="robots" content={`max-snippet:${metadata.robots?.maxSnippet}`} />
                <meta name="robots" content={`max-image-preview:${metadata.robots?.maxImagePreview}`} />

                {/* Viewport */}
                <meta name="viewport" content={`width=${viewport.width}, initial-scale=${viewport.initialScale}, maximum-scale=${viewport.maximumScale}`} />
                <meta name="theme-color" content={viewport.themeColor} />
            </head>

            {/* Main Content */}
            <div className="bg-gray-100 min-h-screen">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold mb-4">
                        Consult General Physician/Internal Medicine Doctors Online
                    </h1>

                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Filters Sidebar */}
                        <div className="w-full lg:w-1/4">
                            <Button
                                className="w-full mb-4 lg:hidden"
                                onClick={toggleFilters}
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </Button>
                            <AnimatePresence>
                                {(showFilters || window.innerWidth >= 1024) && (
                                    <motion.div
                                        initial={{ x: '-100%', opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: '-100%', opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-lg shadow-md p-4 space-y-4"
                                    >
                                        <h2 className="text-lg font-semibold flex items-center">
                                            <Filter className="mr-2 h-5 w-5" />
                                            Filters
                                        </h2>

                                        {/* Specialty Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Specialty</label>
                                            <Select
                                                onValueChange={(value) => handleFilterChange('specialty', value)}
                                                value={filters.specialty}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="All Specialties" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">All Specialties</SelectItem>
                                                    <SelectItem value="General Physician">General Physician</SelectItem>
                                                    <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                                                    {/* Add more specialties as needed */}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Location Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Location</label>
                                            <Select
                                                onValueChange={(value) => handleFilterChange('location', value)}
                                                value={filters.location}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="All Locations" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">All Locations</SelectItem>
                                                    <SelectItem value="Delhi">Delhi</SelectItem>
                                                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                                                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                                                    <SelectItem value="Chennai">Chennai</SelectItem>
                                                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                                                    <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                                                    <SelectItem value="Pune">Pune</SelectItem>
                                                    {/* Add more locations */}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Availability Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Availability</label>
                                            <Select
                                                onValueChange={(value) =>
                                                    handleFilterChange(
                                                        'availability',
                                                        value === '' ? undefined : value === 'true'
                                                    )
                                                }
                                                value={
                                                    filters.availability === undefined
                                                        ? ''
                                                        : filters.availability
                                                            ? 'true'
                                                            : 'false'
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="All" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">All</SelectItem>
                                                    <SelectItem value="true">Available</SelectItem>
                                                    <SelectItem value="false">Unavailable</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Rating Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Rating</label>
                                            <Select
                                                onValueChange={(value) => handleFilterChange('rating', value)}
                                                value={filters.rating}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Any Rating" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">Any Rating</SelectItem>
                                                    <SelectItem value="4">4+</SelectItem>
                                                    <SelectItem value="4.5">4.5+</SelectItem>
                                                    <SelectItem value="5">5</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Sort Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Sort By</label>
                                            <Select
                                                onValueChange={(value) => handleFilterChange('sort', value)}
                                                value={filters.sort}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Relevance" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">Relevance</SelectItem>
                                                    <SelectItem value="rating">Rating</SelectItem>
                                                    <SelectItem value="experience">Experience</SelectItem>
                                                    <SelectItem value="fees-asc">Fees: Low to High</SelectItem>
                                                    <SelectItem value="fees-desc">Fees: High to Low</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Doctor Listing */}
                        <div className="w-full lg:w-3/4">
                            {/* Search Bar */}
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    placeholder="Search for doctors, specialties, or hospitals..."
                                    className="w-full"
                                />
                            </div>

                            {/* Display Grid/List Toggle (Optional) */}
                            {/*
                            <div className="flex justify-end mb-4">
                                <Button variant="outline" className="mr-2">
                                    <Grid className="mr-2 h-4 w-4" /> Grid
                                </Button>
                                <Button variant="outline">
                                    <List className="mr-2 h-4 w-4" /> List
                                </Button>
                            </div>
                            */}

                            {/* Doctor Cards */}
                            {loading ? (
                                <div className="flex justify-center items-center h-48">
                                    <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
                                </div>
                            ) : (
                                <div>
                                    {doctors.map((doctor) => (
                                        <DoctorCard key={doctor.id} doctor={doctor} />
                                    ))}
                                    {doctors.length === 0 && (
                                        <div className="text-center text-gray-500 py-8">
                                            No doctors found matching your criteria.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-4 space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        className="px-3 py-1.5"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="flex items-center text-gray-700">
                                        Page {page} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages}
                                        className="px-3 py-1.5"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DoctorsPage;

