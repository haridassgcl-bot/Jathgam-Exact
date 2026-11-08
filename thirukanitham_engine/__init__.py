"""
Thirukanitham Vedic Astrology Calculation Engine (திருக்கணிதம்)
Source of Truth for Tamil Vedic Astrology Calculations.
"""

from .ephemeris import ThirukanithamEphemeris
from .panchangam import ThirukanithamPanchangam
from .planets import PlanetaryEngine
from .bhavas import BhavaEngine
from .vargas import VargaEngine
from .dasha import DashaEngine
from .ashtakavarga import AshtakavargaEngine
from .yogas import YogaEngine
from .transits import TransitEngine
from .shadbala import ShadbalaEngine
from .report_generator import generate_tamil_astrology_report

__version__ = "2.0.0"
__all__ = [
    "ThirukanithamEphemeris",
    "ThirukanithamPanchangam",
    "PlanetaryEngine",
    "BhavaEngine",
    "VargaEngine",
    "DashaEngine",
    "AshtakavargaEngine",
    "YogaEngine",
    "TransitEngine",
    "ShadbalaEngine",
    "generate_tamil_astrology_report"
]
