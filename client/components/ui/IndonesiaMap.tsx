"use client";

import { useState, useCallback, memo, useEffect, useRef } from "react";
import { MapPin, Loader2, Info, X } from "lucide-react";

// Data provinsi Indonesia dengan informasi budaya
const provinceData: Record<string, { name: string; culture: string; capital: string; region: string }> = {
    "ID-AC": { name: "Aceh", culture: "Tari Saman, Rumoh Aceh", capital: "Banda Aceh", region: "Sumatera" },
    "ID-SU": { name: "Sumatera Utara", culture: "Toba, Ulos, Tor-Tor", capital: "Medan", region: "Sumatera" },
    "ID-SB": { name: "Sumatera Barat", culture: "Rumah Gadang, Randai", capital: "Padang", region: "Sumatera" },
    "ID-RI": { name: "Riau", culture: "Tari Zapin, Lancang Kuning", capital: "Pekanbaru", region: "Sumatera" },
    "ID-JA": { name: "Jambi", culture: "Batik Jambi, Tari Sekapur Sirih", capital: "Jambi", region: "Sumatera" },
    "ID-SS": { name: "Sumatera Selatan", culture: "Songket Palembang, Rumah Limas", capital: "Palembang", region: "Sumatera" },
    "ID-BE": { name: "Bengkulu", culture: "Tari Andun, Rumah Bubungan Lima", capital: "Bengkulu", region: "Sumatera" },
    "ID-LA": { name: "Lampung", culture: "Tapis Lampung, Tari Melinting", capital: "Bandar Lampung", region: "Sumatera" },
    "ID-BB": { name: "Bangka Belitung", culture: "Tari Campak, Rumah Panggung", capital: "Pangkal Pinang", region: "Sumatera" },
    "ID-KR": { name: "Kepulauan Riau", culture: "Tari Joget, Gurindam 12", capital: "Tanjung Pinang", region: "Sumatera" },
    "ID-JK": { name: "DKI Jakarta", culture: "Ondel-ondel, Betawi", capital: "Jakarta", region: "Jawa" },
    "ID-JB": { name: "Jawa Barat", culture: "Wayang Golek, Angklung", capital: "Bandung", region: "Jawa" },
    "ID-JT": { name: "Jawa Tengah", culture: "Batik Solo, Wayang Kulit", capital: "Semarang", region: "Jawa" },
    "ID-YO": { name: "DI Yogyakarta", culture: "Kraton, Ramayana Ballet", capital: "Yogyakarta", region: "Jawa" },
    "ID-JI": { name: "Jawa Timur", culture: "Reog Ponorogo, Ludruk", capital: "Surabaya", region: "Jawa" },
    "ID-BT": { name: "Banten", culture: "Debus, Baduy", capital: "Serang", region: "Jawa" },
    "ID-BA": { name: "Bali", culture: "Tari Kecak, Pura, Barong", capital: "Denpasar", region: "Bali & Nusa Tenggara" },
    "ID-NB": { name: "Nusa Tenggara Barat", culture: "Tenun Sasak, Bau Nyale", capital: "Mataram", region: "Bali & Nusa Tenggara" },
    "ID-NT": { name: "Nusa Tenggara Timur", culture: "Tenun Ikat, Pasola", capital: "Kupang", region: "Bali & Nusa Tenggara" },
    "ID-KB": { name: "Kalimantan Barat", culture: "Dayak, Gawai Dayak", capital: "Pontianak", region: "Kalimantan" },
    "ID-KT": { name: "Kalimantan Tengah", culture: "Tiwah, Rumah Betang", capital: "Palangkaraya", region: "Kalimantan" },
    "ID-KS": { name: "Kalimantan Selatan", culture: "Tari Baksa Kembang", capital: "Banjarmasin", region: "Kalimantan" },
    "ID-KI": { name: "Kalimantan Timur", culture: "Erau Festival", capital: "Samarinda", region: "Kalimantan" },
    "ID-KU": { name: "Kalimantan Utara", culture: "Irau Festival", capital: "Tanjung Selor", region: "Kalimantan" },
    "ID-SA": { name: "Sulawesi Utara", culture: "Kabasaran, Maleo", capital: "Manado", region: "Sulawesi" },
    "ID-ST": { name: "Sulawesi Tengah", culture: "Patung Megalit", capital: "Palu", region: "Sulawesi" },
    "ID-SN": { name: "Sulawesi Selatan", culture: "Toraja, Bugis, Pinisi", capital: "Makassar", region: "Sulawesi" },
    "ID-SG": { name: "Sulawesi Tenggara", culture: "Tari Lulo, Buton", capital: "Kendari", region: "Sulawesi" },
    "ID-GO": { name: "Gorontalo", culture: "Tari Dana-Dana", capital: "Gorontalo", region: "Sulawesi" },
    "ID-SR": { name: "Sulawesi Barat", culture: "Mandar, Mamasa", capital: "Mamuju", region: "Sulawesi" },
    "ID-MA": { name: "Maluku", culture: "Tari Cakalele, Pela Gandong", capital: "Ambon", region: "Maluku & Papua" },
    "ID-MU": { name: "Maluku Utara", culture: "Kesultanan Ternate", capital: "Sofifi", region: "Maluku & Papua" },
    "ID-PB": { name: "Papua Barat", culture: "Raja Ampat, Arfak", capital: "Manokwari", region: "Maluku & Papua" },
    "ID-PA": { name: "Papua", culture: "Honai, Tari Perang, Asmat", capital: "Jayapura", region: "Maluku & Papua" },
    "ID-PD": { name: "Papua Barat Daya", culture: "Suku Moi, Suku Seget", capital: "Sorong", region: "Maluku & Papua" },
    "ID-PT": { name: "Papua Tengah", culture: "Suku Dani, Suku Lani", capital: "Nabire", region: "Maluku & Papua" },
    "ID-PP": { name: "Papua Pegunungan", culture: "Suku Yali, Koteka", capital: "Wamena", region: "Maluku & Papua" },
    "ID-PS": { name: "Papua Selatan", culture: "Suku Asmat, Suku Mimika", capital: "Merauke", region: "Maluku & Papua" },
};

// Mapping berbagai format ID ke format standar
const idMappings: Record<string, string> = {
    // Format standar ISO
    "ID-AC": "ID-AC", "ID-SU": "ID-SU", "ID-SB": "ID-SB", "ID-RI": "ID-RI",
    "ID-JA": "ID-JA", "ID-SS": "ID-SS", "ID-BE": "ID-BE", "ID-LA": "ID-LA",
    "ID-BB": "ID-BB", "ID-KR": "ID-KR", "ID-JK": "ID-JK", "ID-JB": "ID-JB",
    "ID-JT": "ID-JT", "ID-YO": "ID-YO", "ID-JI": "ID-JI", "ID-BT": "ID-BT",
    "ID-BA": "ID-BA", "ID-NB": "ID-NB", "ID-NT": "ID-NT", "ID-KB": "ID-KB",
    "ID-KT": "ID-KT", "ID-KS": "ID-KS", "ID-KI": "ID-KI", "ID-KU": "ID-KU",
    "ID-SA": "ID-SA", "ID-ST": "ID-ST", "ID-SN": "ID-SN", "ID-SG": "ID-SG",
    "ID-GO": "ID-GO", "ID-SR": "ID-SR", "ID-MA": "ID-MA", "ID-MU": "ID-MU",
    "ID-PB": "ID-PB", "ID-PA": "ID-PA", "ID-PD": "ID-PD", "ID-PT": "ID-PT",
    "ID-PP": "ID-PP", "ID-PS": "ID-PS",
    // Format tanpa tanda hubung
    "IDAC": "ID-AC", "IDSU": "ID-SU", "IDSB": "ID-SB", "IDRI": "ID-RI",
    "IDJA": "ID-JA", "IDSS": "ID-SS", "IDBE": "ID-BE", "IDLA": "ID-LA",
    "IDBB": "ID-BB", "IDKR": "ID-KR", "IDJK": "ID-JK", "IDJB": "ID-JB",
    "IDJT": "ID-JT", "IDYO": "ID-YO", "IDJI": "ID-JI", "IDBT": "ID-BT",
    "IDBA": "ID-BA", "IDNB": "ID-NB", "IDNT": "ID-NT", "IDKB": "ID-KB",
    "IDKT": "ID-KT", "IDKS": "ID-KS", "IDKI": "ID-KI", "IDKU": "ID-KU",
    "IDSA": "ID-SA", "IDST": "ID-ST", "IDSN": "ID-SN", "IDSG": "ID-SG",
    "IDGO": "ID-GO", "IDSR": "ID-SR", "IDMA": "ID-MA", "IDMU": "ID-MU",
    "IDPB": "ID-PB", "IDPA": "ID-PA", "IDPD": "ID-PD", "IDPT": "ID-PT",
    "IDPP": "ID-PP", "IDPS": "ID-PS",
};

const IndonesiaMap = memo(function IndonesiaMap() {
    const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    // Normalisasi ID provinsi
    const normalizeId = useCallback((id: string): string | null => {
        if (!id) return null;
        const normalized = idMappings[id] || idMappings[id.toUpperCase()] || idMappings[id.toLowerCase()];
        return normalized || null;
    }, []);

    // Dapatkan data provinsi berdasarkan ID
    const getProvinceData = useCallback((id: string) => {
        if (!id) return null;
        const normalizedId = normalizeId(id);
        if (normalizedId && provinceData[normalizedId]) {
            return { id: normalizedId, ...provinceData[normalizedId] };
        }
        if (provinceData[id]) {
            return { id, ...provinceData[id] };
        }
        return null;
    }, [normalizeId]);

    // Style elemen SVG untuk interaktivitas
    const styleElement = useCallback((element: SVGElement, id: string, name: string) => {
        try {
            const provinceInfo = getProvinceData(id) || getProvinceData(name);
            
            if (!provinceInfo) return;

            element.style.fill = selectedProvince === provinceInfo.id ? '#10b981' : '#1f2937';
            element.style.stroke = '#10b981';
            element.style.strokeWidth = '0.5';
            element.style.cursor = 'pointer';
            element.style.transition = 'all 0.3s ease';

            if (selectedProvince === provinceInfo.id) {
                element.style.filter = 'brightness(1.3) drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))';
            }

            element.addEventListener('mouseenter', (e) => {
                element.style.fill = '#10b981';
                element.style.strokeWidth = '1.5';
                element.style.filter = 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.7))';

                const provinceInfo = getProvinceData(id) || getProvinceData(name);
                if (provinceInfo) {
                    setHoveredProvince(provinceInfo.id);
                }

                const mouseEvent = e as MouseEvent;
                setMousePos({ x: mouseEvent.clientX, y: mouseEvent.clientY });
            });

            element.addEventListener('mousemove', (e) => {
                const mouseEvent = e as MouseEvent;
                setMousePos({ x: mouseEvent.clientX, y: mouseEvent.clientY });
            });

            element.addEventListener('mouseleave', () => {
                const normalizedId = normalizeId(id) || normalizeId(name);
                if (normalizedId !== selectedProvince) {
                    element.style.fill = '#1f2937';
                    element.style.strokeWidth = '0.5';
                    element.style.filter = 'none';
                }
                setHoveredProvince(null);
            });

            element.addEventListener('click', () => {
                const provinceInfo = getProvinceData(id) || getProvinceData(name);
                if (provinceInfo) {
                    setSelectedProvince(provinceInfo.id);
                }
            });
        } catch (error) {
            console.error('Error styling element:', { id, name, error });
        }
    }, [getProvinceData, normalizeId, selectedProvince]);

    // Load SVG
    useEffect(() => {
        const loadSvg = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const response = await fetch('/peta/id.svg');
                
                if (!response.ok) {
                    throw new Error(`Gagal memuat peta: HTTP ${response.status}`);
                }
                
                const svgText = await response.text();

                if (containerRef.current) {
                    const parser = new DOMParser();
                    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                    const svgElement = svgDoc.querySelector('svg');
                    
                    const parseError = svgDoc.querySelector('parsererror');
                    if (parseError) {
                        throw new Error('Format SVG tidak valid');
                    }

                    if (svgElement) {
                        svgElement.style.width = '100%';
                        svgElement.style.height = 'auto';
                        svgElement.style.maxHeight = '600px';
                        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                        const paths = svgElement.querySelectorAll('path');
                        const polygons = svgElement.querySelectorAll('polygon');
                        const groups = svgElement.querySelectorAll('g[id]');

                        paths.forEach((path) => {
                            const id = path.getAttribute('id') || path.getAttribute('data-id') || '';
                            const name = path.getAttribute('name') || path.getAttribute('data-name') || path.getAttribute('title') || '';
                            if (id || name) {
                                styleElement(path as SVGElement, id, name);
                            }
                        });

                        polygons.forEach((polygon) => {
                            const id = polygon.getAttribute('id') || polygon.getAttribute('data-id') || '';
                            const name = polygon.getAttribute('name') || polygon.getAttribute('data-name') || polygon.getAttribute('title') || '';
                            if (id || name) {
                                styleElement(polygon as SVGElement, id, name);
                            }
                        });

                        groups.forEach((group) => {
                            const id = group.getAttribute('id') || '';
                            const name = group.getAttribute('name') || group.getAttribute('data-name') || group.getAttribute('title') || '';
                            
                            if (getProvinceData(id) || getProvinceData(name)) {
                                const childPaths = group.querySelectorAll('path, polygon');
                                childPaths.forEach((child) => {
                                    styleElement(child as SVGElement, id, name);
                                });
                            }
                        });

                        const svgContainer = containerRef.current.querySelector('.svg-container');
                        if (svgContainer) {
                            svgContainer.innerHTML = '';
                            svgContainer.appendChild(svgElement);
                            svgRef.current = svgElement as unknown as SVGSVGElement;
                        }
                        
                        setIsLoading(false);
                    } else {
                        throw new Error('Elemen SVG tidak ditemukan');
                    }
                }
            } catch (err) {
                console.error('Error loading map:', err);
                setError(err instanceof Error ? err.message : 'Gagal memuat peta Indonesia');
                setIsLoading(false);
            }
        };

        loadSvg();
    }, [getProvinceData, styleElement]);

    const hoveredData = hoveredProvince ? provinceData[hoveredProvince] : null;
    const selectedData = selectedProvince ? provinceData[selectedProvince] : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Peta Interaktif Indonesia
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">
                        Jelajahi 38 provinsi di Indonesia dengan budaya yang beragam
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Map Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 shadow-2xl" ref={containerRef}>
                            {/* Tooltip */}
                            {hoveredProvince && hoveredData && (
                                <div
                                    className="fixed z-50 px-4 py-3 bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl pointer-events-none border border-emerald-500/40"
                                    style={{
                                        left: mousePos.x + 15,
                                        top: mousePos.y + 15,
                                    }}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin className="w-4 h-4 text-emerald-400" />
                                        <p className="text-emerald-400 font-bold text-sm">{hoveredData.name}</p>
                                    </div>
                                    <p className="text-gray-300 text-xs">📍 {hoveredData.capital}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">🎭 {hoveredData.culture}</p>
                                </div>
                            )}

                            {/* SVG Container */}
                            <div
                                className="svg-container w-full flex items-center justify-center bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl overflow-hidden"
                                style={{ minHeight: '450px' }}
                            >
                                {isLoading && (
                                    <div className="flex flex-col items-center gap-3 text-gray-400">
                                        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                                        <span className="text-sm">Memuat peta Indonesia...</span>
                                    </div>
                                )}
                                
                                {error && !isLoading && (
                                    <div className="flex flex-col items-center gap-3 text-center px-4">
                                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                                            <MapPin className="w-8 h-8 text-red-400" />
                                        </div>
                                        <p className="text-red-400 text-sm">{error}</p>
                                        <p className="text-gray-500 text-xs">Pastikan file peta tersedia di /peta/id.svg</p>
                                    </div>
                                )}
                            </div>

                            {/* Legend */}
                            {!error && (
                                <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded bg-gray-800 border border-emerald-500/50"></div>
                                        <span>Provinsi</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded bg-emerald-500"></div>
                                        <span>Hover/Dipilih</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-emerald-400">🖱️</span>
                                        <span>Klik untuk detail</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div className="lg:col-span-1">
                        {selectedData ? (
                            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Info className="w-5 h-5 text-emerald-400" />
                                        <h3 className="text-lg font-bold text-emerald-400">Detail Provinsi</h3>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedProvince(null)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">{selectedData.name}</h2>
                                        <p className="text-emerald-400 text-sm">{selectedData.region}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-gray-900/50 rounded-lg p-3">
                                            <p className="text-xs text-gray-400 mb-1">Ibukota</p>
                                            <p className="text-white font-semibold">📍 {selectedData.capital}</p>
                                        </div>

                                        <div className="bg-gray-900/50 rounded-lg p-3">
                                            <p className="text-xs text-gray-400 mb-1">Budaya & Tradisi</p>
                                            <p className="text-white">🎭 {selectedData.culture}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-6 shadow-xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <Info className="w-5 h-5 text-gray-500" />
                                    <h3 className="text-lg font-bold text-gray-500">Detail Provinsi</h3>
                                </div>
                                <p className="text-gray-500 text-sm text-center py-8">
                                    Klik pada provinsi di peta untuk melihat informasi lengkap
                                </p>
                            </div>
                        )}

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-xl p-4 text-center">
                                <p className="text-3xl font-bold text-emerald-400">38</p>
                                <p className="text-xs text-emerald-300/80 mt-1">Total Provinsi</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-4 text-center">
                                <p className="text-3xl font-bold text-blue-400">6</p>
                                <p className="text-xs text-blue-300/80 mt-1">Wilayah Utama</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default IndonesiaMap;