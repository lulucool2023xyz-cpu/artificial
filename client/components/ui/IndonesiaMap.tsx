"use client";

import { useState, useCallback, memo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Loader2 } from "lucide-react";

// Province data with cultural info - ISO 3166-2:ID codes
const provinceData: Record<string, { name: string; culture: string; capital: string }> = {
    // Aceh
    "ID-AC": { name: "Aceh", culture: "Tari Saman, Rumoh Aceh", capital: "Banda Aceh" },
    // Sumatera Utara
    "ID-SU": { name: "Sumatera Utara", culture: "Toba, Ulos, Tor-Tor", capital: "Medan" },
    // Sumatera Barat
    "ID-SB": { name: "Sumatera Barat", culture: "Rumah Gadang, Randai", capital: "Padang" },
    // Riau
    "ID-RI": { name: "Riau", culture: "Tari Zapin, Lancang Kuning", capital: "Pekanbaru" },
    // Jambi
    "ID-JA": { name: "Jambi", culture: "Batik Jambi, Tari Sekapur Sirih", capital: "Jambi" },
    // Sumatera Selatan
    "ID-SS": { name: "Sumatera Selatan", culture: "Songket Palembang, Rumah Limas", capital: "Palembang" },
    // Bengkulu
    "ID-BE": { name: "Bengkulu", culture: "Tari Andun, Rumah Bubungan Lima", capital: "Bengkulu" },
    // Lampung
    "ID-LA": { name: "Lampung", culture: "Tapis Lampung, Tari Melinting", capital: "Bandar Lampung" },
    // Bangka Belitung
    "ID-BB": { name: "Bangka Belitung", culture: "Tari Campak, Rumah Panggung", capital: "Pangkal Pinang" },
    // Kepulauan Riau
    "ID-KR": { name: "Kepulauan Riau", culture: "Tari Joget, Gurindam 12", capital: "Tanjung Pinang" },
    // DKI Jakarta
    "ID-JK": { name: "DKI Jakarta", culture: "Ondel-ondel, Betawi", capital: "Jakarta" },
    // Jawa Barat
    "ID-JB": { name: "Jawa Barat", culture: "Wayang Golek, Angklung", capital: "Bandung" },
    // Jawa Tengah
    "ID-JT": { name: "Jawa Tengah", culture: "Batik Solo, Wayang Kulit", capital: "Semarang" },
    // DI Yogyakarta
    "ID-YO": { name: "DI Yogyakarta", culture: "Kraton, Ramayana Ballet", capital: "Yogyakarta" },
    // Jawa Timur
    "ID-JI": { name: "Jawa Timur", culture: "Reog Ponorogo, Ludruk", capital: "Surabaya" },
    // Banten
    "ID-BT": { name: "Banten", culture: "Debus, Baduy", capital: "Serang" },
    // Bali
    "ID-BA": { name: "Bali", culture: "Tari Kecak, Pura, Barong", capital: "Denpasar" },
    // Nusa Tenggara Barat
    "ID-NB": { name: "Nusa Tenggara Barat", culture: "Tenun Sasak, Bau Nyale", capital: "Mataram" },
    // Nusa Tenggara Timur
    "ID-NT": { name: "Nusa Tenggara Timur", culture: "Tenun Ikat, Pasola", capital: "Kupang" },
    // Kalimantan Barat
    "ID-KB": { name: "Kalimantan Barat", culture: "Dayak, Gawai Dayak", capital: "Pontianak" },
    // Kalimantan Tengah
    "ID-KT": { name: "Kalimantan Tengah", culture: "Tiwah, Rumah Betang", capital: "Palangkaraya" },
    // Kalimantan Selatan
    "ID-KS": { name: "Kalimantan Selatan", culture: "Tari Baksa Kembang", capital: "Banjarmasin" },
    // Kalimantan Timur
    "ID-KI": { name: "Kalimantan Timur", culture: "Erau Festival", capital: "Samarinda" },
    // Kalimantan Utara
    "ID-KU": { name: "Kalimantan Utara", culture: "Irau Festival", capital: "Tanjung Selor" },
    // Sulawesi Utara
    "ID-SA": { name: "Sulawesi Utara", culture: "Kabasaran, Maleo", capital: "Manado" },
    // Sulawesi Tengah
    "ID-ST": { name: "Sulawesi Tengah", culture: "Patung Megalit", capital: "Palu" },
    // Sulawesi Selatan
    "ID-SN": { name: "Sulawesi Selatan", culture: "Toraja, Bugis, Pinisi", capital: "Makassar" },
    // Sulawesi Tenggara
    "ID-SG": { name: "Sulawesi Tenggara", culture: "Tari Lulo, Buton", capital: "Kendari" },
    // Gorontalo
    "ID-GO": { name: "Gorontalo", culture: "Tari Dana-Dana", capital: "Gorontalo" },
    // Sulawesi Barat
    "ID-SR": { name: "Sulawesi Barat", culture: "Mandar, Mamasa", capital: "Mamuju" },
    // Maluku
    "ID-MA": { name: "Maluku", culture: "Tari Cakalele, Pela Gandong", capital: "Ambon" },
    // Maluku Utara
    "ID-MU": { name: "Maluku Utara", culture: "Kesultanan Ternate", capital: "Sofifi" },
    // Papua Barat
    "ID-PB": { name: "Papua Barat", culture: "Raja Ampat, Arfak", capital: "Manokwari" },
    // Papua
    "ID-PA": { name: "Papua", culture: "Honai, Tari Perang, Asmat", capital: "Jayapura" },
    // Papua Barat Daya
    "ID-PD": { name: "Papua Barat Daya", culture: "Suku Moi, Suku Seget", capital: "Sorong" },
    // Papua Tengah
    "ID-PT": { name: "Papua Tengah", culture: "Suku Dani, Suku Lani", capital: "Nabire" },
    // Papua Pegunungan
    "ID-PP": { name: "Papua Pegunungan", culture: "Suku Yali, Koteka", capital: "Wamena" },
    // Papua Selatan
    "ID-PS": { name: "Papua Selatan", culture: "Suku Asmat, Suku Mimika", capital: "Merauke" },
};

// Alternative ID mappings (some SVGs use different formats)
const idMappings: Record<string, string> = {
    // Standard ISO codes
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
    // Alternative codes (without hyphen)
    "IDAC": "ID-AC", "IDSU": "ID-SU", "IDSB": "ID-SB", "IDRI": "ID-RI",
    "IDJA": "ID-JA", "IDSS": "ID-SS", "IDBE": "ID-BE", "IDLA": "ID-LA",
    "IDBB": "ID-BB", "IDKR": "ID-KR", "IDJK": "ID-JK", "IDJB": "ID-JB",
    "IDJT": "ID-JT", "IDYO": "ID-YO", "IDJI": "ID-JI", "IDBT": "ID-BT",
    "IDBA": "ID-BA", "IDNB": "ID-NB", "IDNT": "ID-NT", "IDKB": "ID-KB",
    "IDKT": "ID-KT", "IDKS": "ID-KS", "IDKI": "ID-KI", "IDKU": "ID-KU",
    "IDSA": "ID-SA", "IDST": "ID-ST", "IDSN": "ID-SN", "IDSG": "ID-SG",
    "IDGO": "ID-GO", "IDSR": "ID-SR", "IDMA": "ID-MA", "IDMU": "ID-MU",
    "IDPB": "ID-PB", "IDPA": "ID-PA",
    // Common name mappings
    "aceh": "ID-AC", "sumut": "ID-SU", "sumbar": "ID-SB", "riau": "ID-RI",
    "jambi": "ID-JA", "sumsel": "ID-SS", "bengkulu": "ID-BE", "lampung": "ID-LA",
    "babel": "ID-BB", "kepri": "ID-KR", "jakarta": "ID-JK", "jabar": "ID-JB",
    "jateng": "ID-JT", "yogyakarta": "ID-YO", "jatim": "ID-JI", "banten": "ID-BT",
    "bali": "ID-BA", "ntb": "ID-NB", "ntt": "ID-NT", "kalbar": "ID-KB",
    "kalteng": "ID-KT", "kalsel": "ID-KS", "kaltim": "ID-KI", "kaltara": "ID-KU",
    "sulut": "ID-SA", "sulteng": "ID-ST", "sulsel": "ID-SN", "sultra": "ID-SG",
    "gorontalo": "ID-GO", "sulbar": "ID-SR", "maluku": "ID-MA", "malut": "ID-MU",
    "papuabarat": "ID-PB", "papua": "ID-PA",
};

interface IndonesiaMapProps {
    onProvinceClick?: (provinceId: string, provinceName: string, culture: string, capital: string) => void;
    className?: string;
    showStats?: boolean;
    showLegend?: boolean;
    compact?: boolean;
}

const IndonesiaMap = memo(function IndonesiaMap({ 
    onProvinceClick, 
    className,
    showStats = true,
    showLegend = true,
    compact = false
}: IndonesiaMapProps) {
    const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    // Normalize province ID to standard format
    const normalizeId = useCallback((id: string): string | null => {
        if (!id) return null;
        const normalized = idMappings[id] || idMappings[id.toUpperCase()] || idMappings[id.toLowerCase()];
        return normalized || null;
    }, []);

    // Get province data by any ID format
    const getProvinceData = useCallback((id: string) => {
        if (!id) return null;
        const normalizedId = normalizeId(id);
        if (normalizedId && provinceData[normalizedId]) {
            return { id: normalizedId, ...provinceData[normalizedId] };
        }
        // Direct lookup
        if (provinceData[id]) {
            return { id, ...provinceData[id] };
        }
        return null;
    }, [normalizeId]);

    // Style an SVG element for interactivity
    const styleElement = useCallback((element: SVGElement, id: string, name: string) => {
        // Apply base styles
        element.style.fill = '#374151';
        element.style.stroke = '#C9A04F';
        element.style.strokeWidth = '0.5';
        element.style.cursor = 'pointer';
        element.style.transition = 'all 0.2s ease';

        // Add event listeners
        element.addEventListener('mouseenter', (e) => {
            element.style.fill = '#C9A04F';
            element.style.strokeWidth = '1.5';
            element.style.filter = 'drop-shadow(0 0 6px rgba(201, 160, 79, 0.6))';

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
                element.style.fill = '#374151';
                element.style.strokeWidth = '0.5';
                element.style.filter = 'none';
            }
            setHoveredProvince(null);
        });

        element.addEventListener('click', () => {
            const provinceInfo = getProvinceData(id) || getProvinceData(name);
            if (provinceInfo) {
                setSelectedProvince(provinceInfo.id);
                onProvinceClick?.(provinceInfo.id, provinceInfo.name, provinceInfo.culture, provinceInfo.capital);
            }
        });
    }, [getProvinceData, normalizeId, onProvinceClick, selectedProvince]);

    // Load and enhance SVG
    useEffect(() => {
        const loadSvg = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const response = await fetch('/peta/id.svg');
                if (!response.ok) {
                    throw new Error(`Failed to load map: ${response.status}`);
                }
                const svgText = await response.text();

                if (containerRef.current) {
                    // Create a container for the SVG
                    const parser = new DOMParser();
                    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                    const svgElement = svgDoc.querySelector('svg');
                    
                    // Check for parse errors
                    const parseError = svgDoc.querySelector('parsererror');
                    if (parseError) {
                        throw new Error('Invalid SVG format');
                    }

                    if (svgElement) {
                        // Style the SVG
                        svgElement.style.width = '100%';
                        svgElement.style.height = 'auto';
                        svgElement.style.maxHeight = compact ? '300px' : '500px';
                        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                        // Find all interactive elements (paths, polygons, groups with IDs)
                        const paths = svgElement.querySelectorAll('path');
                        const polygons = svgElement.querySelectorAll('polygon');
                        const groups = svgElement.querySelectorAll('g[id]');

                        // Process paths
                        paths.forEach((path) => {
                            const id = path.getAttribute('id') || path.getAttribute('data-id') || '';
                            const name = path.getAttribute('name') || path.getAttribute('data-name') || path.getAttribute('title') || '';
                            styleElement(path as SVGElement, id, name);
                        });

                        // Process polygons
                        polygons.forEach((polygon) => {
                            const id = polygon.getAttribute('id') || polygon.getAttribute('data-id') || '';
                            const name = polygon.getAttribute('name') || polygon.getAttribute('data-name') || polygon.getAttribute('title') || '';
                            styleElement(polygon as SVGElement, id, name);
                        });

                        // Process groups (if they represent provinces)
                        groups.forEach((group) => {
                            const id = group.getAttribute('id') || '';
                            const name = group.getAttribute('name') || group.getAttribute('data-name') || group.getAttribute('title') || '';
                            
                            // Only style if it's a province group (has matching data)
                            if (getProvinceData(id) || getProvinceData(name)) {
                                const childPaths = group.querySelectorAll('path, polygon');
                                childPaths.forEach((child) => {
                                    styleElement(child as SVGElement, id, name);
                                });
                            }
                        });

                        // Clear and insert SVG
                        const svgContainer = containerRef.current.querySelector('.svg-container');
                        if (svgContainer) {
                            svgContainer.innerHTML = '';
                            svgContainer.appendChild(svgElement);
                            svgRef.current = svgElement as unknown as SVGSVGElement;
                        }
                        
                        setIsLoading(false);
                    } else {
                        throw new Error('No SVG element found');
                    }
                }
            } catch (err) {
                console.error('Error loading SVG:', err);
                setError(err instanceof Error ? err.message : 'Gagal memuat peta');
                setIsLoading(false);
            }
        };

        loadSvg();
    }, [getProvinceData, styleElement, compact]);

    const hoveredData = hoveredProvince ? provinceData[hoveredProvince] : null;

    return (
        <div className={`relative ${className || ''}`} ref={containerRef}>
            {/* Tooltip */}
            <AnimatePresence>
                {hoveredProvince && hoveredData && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="fixed z-[100] px-4 py-3 bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl pointer-events-none border border-[#C9A04F]/40"
                        style={{
                            left: mousePos.x + 15,
                            top: mousePos.y + 15,
                        }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-[#C9A04F]" />
                            <p className="text-[#C9A04F] font-bold text-sm">{hoveredData.name}</p>
                        </div>
                        <p className="text-gray-300 text-xs">📍 Ibukota: {hoveredData.capital}</p>
                        <p className="text-gray-400 text-xs mt-0.5">🎭 Budaya: {hoveredData.culture}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SVG Container */}
            <div
                className="svg-container w-full flex items-center justify-center bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl overflow-hidden"
                style={{ minHeight: compact ? '250px' : '350px' }}
            >
                {/* Loading state */}
                {isLoading && (
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin text-[#C9A04F]" />
                        <span className="text-sm">Memuat peta Indonesia...</span>
                    </div>
                )}
                
                {/* Error state */}
                {error && !isLoading && (
                    <div className="flex flex-col items-center gap-3 text-center px-4">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                            <MapPin className="w-8 h-8 text-red-400" />
                        </div>
                        <p className="text-red-400 text-sm">{error}</p>
                        <p className="text-muted-foreground text-xs">Pastikan file peta tersedia di /peta/id.svg</p>
                    </div>
                )}
            </div>

            {/* Legend */}
            {showLegend && !error && (
                <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-[#374151] border border-[#C9A04F]/50"></div>
                        <span>Provinsi</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-[#C9A04F]"></div>
                        <span>Hover/Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[#C9A04F]">🖱️</span>
                        <span>Klik untuk info lengkap</span>
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            {showStats && !error && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-xl p-3 text-center"
                    >
                        <p className="text-2xl font-bold text-emerald-400">10</p>
                        <p className="text-xs text-emerald-300/80">Sumatera</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-3 text-center"
                    >
                        <p className="text-2xl font-bold text-blue-400">6</p>
                        <p className="text-xs text-blue-300/80">Jawa</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-xl p-3 text-center"
                    >
                        <p className="text-2xl font-bold text-amber-400">5</p>
                        <p className="text-xs text-amber-300/80">Kalimantan</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-rose-500/20 to-rose-600/10 border border-rose-500/30 rounded-xl p-3 text-center"
                    >
                        <p className="text-2xl font-bold text-rose-400">17</p>
                        <p className="text-xs text-rose-300/80">Sulawesi & Timur</p>
                    </motion.div>
                </div>
            )}
        </div>
    );
});

export default IndonesiaMap;
