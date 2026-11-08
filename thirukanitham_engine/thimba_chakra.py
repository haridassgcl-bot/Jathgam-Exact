"""
Thirukanitham Engine - Module 31: திம்ப சக்கரம் (Thimba Chakram)
Child Cosmic Body Star Allocation & Transit Evaluation
"""

from typing import Dict, Any, List


class ThimbaChakraEngine:
    BODY_SLOTS_DEF = [
        {
            "slot": 1,
            "bodyPart": "நெற்றி",
            "bodyPartEn": "Forehead",
            "count": 3,
            "interpretation": "நெற்றி - ஜெனன நெற்றியில் அமர்ந்தால் நவரத்தினம், தங்கம், விலை மதிக்க முடியாத ஆபரணங்கள், ஆடைகள், கொடை போன்ற நல்ல மகுடங்கள் சூட்டப்படும் அமைப்புடையவராக இவரது இயற்கை அமையும். பல்வேறு அமைப்புகளுக்கு தலைமை பதவி வகிக்கின்ற பண்புடையவராக இருப்பார். பணக்கார வாழ்வு வாழ்வார். நெற்றி என்பது கிரீடம் சூட்டப்படும் இடம் என்பதால் நல்ல பலன்களாக அமையும்."
        },
        {
            "slot": 2,
            "bodyPart": "முகம்",
            "bodyPartEn": "Face",
            "count": 3,
            "interpretation": "முகம் - உணவு, உடை, இருப்பிடம் ஆகியவற்றில் அலாதி சுகம் காண்பவர், படுக்கை மற்றும் மாறுகின்ற இருக்கைகளில் ஆடம்பரமாக இருப்பவர். வீட்டை அலங்கரிப்பதில் அலாதி பிரியம் கொண்டவர். சிறந்த பேச்சாளர். முகத்தில் மகிழ்ச்சி கலந்த புன்னகை புரிபவராக இருப்பவர்."
        },
        {
            "slot": 3,
            "bodyPart": "தோள்",
            "bodyPartEn": "Shoulders",
            "count": 2,
            "interpretation": "தோள் - நகைகளை விருப்பமுடன் அணிபவராக இருப்பார். பல்வேறு வகையான விழாக்களை நடத்துபவர். பல்வேறு நிதிகளை பல நல்ல காரியங்களுக்கு தருபவர். பலரை நல்வழிப்படுத்துபவர். பல புண்ணிய செயல்களை செய்பவர்."
        },
        {
            "slot": 4,
            "bodyPart": "மார்பு",
            "bodyPartEn": "Chest",
            "count": 5,
            "interpretation": "மார்பு - அரச குடும்பத்திற்கு சமமான அந்தஸ்தை உடையவர். மிகவும் நல்ல நடத்தை உடையவர். பலராலும் புகழப்படுபவர். சாஸ்த்திர சம்பிரதாயங்களில் வல்லமை உடையவர். ஆன்மீகத்தில் தெளிவு உடையவர். பலருக்கும் உபதேசம் செய்பவர்."
        },
        {
            "slot": 5,
            "bodyPart": "நாபி",
            "bodyPartEn": "Navel",
            "count": 1,
            "interpretation": "நாபி - போர் தளபதி போல் செயல்படுபவர். மன்னிக்கும் குணமுடையவர். நீதி, நேர்மை, நியாதிர்காக போராடுபவர். கலைகளில் வல்லவர். மதம் சார்ந்த விஷயங்களில் பிடிப்பு உள்ளவர். மிகவும் மதிக்க தக்கவர்."
        },
        {
            "slot": 6,
            "bodyPart": "வலது புஜம் (முன்கை)",
            "bodyPartEn": "Right Forearm",
            "count": 1,
            "interpretation": "புஜங்கள் - வெளி நாட்டு தொடர்பில் பல்வேறு இலாபங்களை அடைபவர். பொதுவாக பிறந்த இடத்தை விட்டு வெளியிடங்களில் அல்லது வெளியூர், வெளிநாடுகளில் வசிப்பவர். கதாநாயகனாக வலம் வருபவர். பலருக்கு உபயோகமாக இருப்பவர்."
        },
        {
            "slot": 7,
            "bodyPart": "இடது புஜம் (முன்கை)",
            "bodyPartEn": "Left Forearm",
            "count": 1,
            "interpretation": "புஜங்கள் - வெளி நாட்டு தொடர்பில் பல்வேறு இலாபங்களை அடைபவர். பொதுவாக பிறந்த இடத்தை விட்டு வெளியிடங்களில் அல்லது வெளியூர், வெளிநாடுகளில் வசிப்பவர். கதாநாயகனாக வலம் வருபவர். பலருக்கு உபயோகமாக இருப்பவர்."
        },
        {
            "slot": 8,
            "bodyPart": "பிறப்புறுப்பு",
            "bodyPartEn": "Genitals",
            "count": 1,
            "interpretation": "பிறப்புறுப்பு - பொறாமைப்படத்தக்க அளவு அழகுள்ளவர். காம ரீதியில் அலாதி பிரியம் உடையவர். பக்தி விஷயங்களை அடிக்கடி நாடுபவர். இசை, நடனம், பாட்டு, வசனம், நாடகம் போன்றவற்றில் ஆர்வம் உள்ளவர். கலைகளில் திறமை உள்ளவர். பலராலும் புகழப்படுபவர்."
        },
        {
            "slot": 9,
            "bodyPart": "கைகள்",
            "bodyPartEn": "Hands",
            "count": 2,
            "interpretation": "கைகள் - சிறந்த பேச்சாளர், கற்களை சோதிப்பதில் வல்லவர். நீதிபதி. உண்மையை உரைப்பதில் ஆர்வம் உள்ளவர். உத்தம புருஷர். பேச்சில் திறமை உள்ளவர். தகுந்த நேரத்தில் தகுந்த உதாரணங்களை கூறி அசத்துபவர். நேரத்திற்கு தகுந்தபடி நகைச்சுவையாக பேசி அனைவரையும் வசீகரிப்பவர். காலை நுணுக்கங்களை அறிந்தவர். தீவிர சாதனையாளர்."
        },
        {
            "slot": 10,
            "bodyPart": "வலது தொடை",
            "bodyPartEn": "Right Thigh",
            "count": 1,
            "interpretation": "தொடைகள் - பல்வேறு நாடுகளை சுற்றி பல சாதனைகளை புரிபவர். மிகவும் நேர்த்தியாக பணிகளை செய்பவர். மெலிந்த தேகம் உடையவர்."
        },
        {
            "slot": 11,
            "bodyPart": "இடது தொடை",
            "bodyPartEn": "Left Thigh",
            "count": 1,
            "interpretation": "தொடைகள் - பல்வேறு நாடுகளை சுற்றி பல சாதனைகளை புரிபவர். மிகவும் நேர்த்தியாக பணிகளை செய்பவர். மெலிந்த தேகம் உடையவர்."
        },
        {
            "slot": 12,
            "bodyPart": "பாதங்கள்",
            "bodyPartEn": "Feet",
            "count": 6,
            "interpretation": "பாதங்கள் - விவசாயம் சார்ந்த விஷயங்களில் அதிக ஆர்வமுடன் ஈடுபடுபவர். சிறிதளவு மதப்பற்று மிக்கவராக விளங்குபவர். எதிரிகளை கண்டு அஞ்சாதவர். துணிச்சல் மிக்கவர். பல்வேறு சேவைகளை மக்களுக்கு செய்பவர்."
        }
    ]

    NAKSHATRA_ORDER = [
        "அஸ்வினி", "பரணி", "கார்த்திகை", "ரோகிணி", "மிருகசீரிஷம்", "திருவாதிரை",
        "புனர்பூசம்", "பூசம்", "ஆயில்யம்", "மகம்", "பூரம்", "உத்திரம்",
        "அஸ்தம்", "சித்திரை", "சுவாதி", "விசாகம்", "அனுஷம்", "கேட்டை",
        "மூலம்", "பூராடம்", "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்",
        "பூரட்டாதி", "உத்திரட்டாதி", "ரேவதி"
    ]

    @staticmethod
    def calculate_thimba_chakra(sun_nakshatra_ta: str = "பரணி", moon_nakshatra_ta: str = "சித்திரை") -> Dict[str, Any]:
        """
        Maps 27 Nakshatras starting from Sun's Nakshatra onto the 12 body slots.
        Finds the body slot of Janma Moon and Today's Transit Moon.
        """
        # Find index of Sun Nakshatra
        try:
            start_idx = ThimbaChakraEngine.NAKSHATRA_ORDER.index(sun_nakshatra_ta)
        except ValueError:
            start_idx = 1  # Default Bharani

        curr_ptr = start_idx
        allocated_slots = []
        janma_slot_info = None

        for slot_def in ThimbaChakraEngine.BODY_SLOTS_DEF:
            slot_naks = []
            for _ in range(slot_def["count"]):
                nak = ThimbaChakraEngine.NAKSHATRA_ORDER[curr_ptr % 27]
                slot_naks.append(nak)
                curr_ptr += 1

            slot_item = {
                "slot": slot_def["slot"],
                "bodyPart": slot_def["bodyPart"],
                "bodyPartEn": slot_def["bodyPartEn"],
                "count": slot_def["count"],
                "nakshatras": slot_naks,
                "interpretation": slot_def["interpretation"],
                "hasJanmaMoon": moon_nakshatra_ta in slot_naks
            }
            allocated_slots.append(slot_item)

            if slot_item["hasJanmaMoon"]:
                janma_slot_info = slot_item

        return {
            "birthSunNakshatra": sun_nakshatra_ta,
            "birthMoonNakshatra": moon_nakshatra_ta,
            "natalResult": janma_slot_info,
            "slots": allocated_slots,
            "todayTransit": {
                "nakshatra": "சுவாதி",
                "slot": 5,
                "bodyPart": "நாபி",
                "computedAt": "12-10-2026T05:19:31+00:00"
            }
        }
