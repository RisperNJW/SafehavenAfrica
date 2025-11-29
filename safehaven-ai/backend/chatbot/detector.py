 import re

class HarmfulContentDetector:
    
    PATTERNS = {
        'threats': [
            r'\b(kill|hurt|harm|destroy|attack|murder|dead|die)\b',
            r'\b(i\'?ll (make sure|find|get) (you|no one))\b',
            r'\b(you\'?re (dead|finished|done for))\b',
            r'\b(watch your back|i know where you)\b',
            r'\b(going to (hurt|kill|harm))\b',
            r'\b(make you (pay|regret|suffer))\b',
        ],
        'harassment': [
            r'\b(worthless|useless|pathetic|disgusting|ugly|stupid)\b',
            r'\b(no one (wants|likes|cares about|would want) you)\b',
            r'\b(you\'?re (a|an) .*(idiot|moron|loser|waste))\b',
            r'\b(shut up|get lost|nobody likes)\b',
            r'\b(piece of (shit|trash|garbage))\b',
        ],
        'gaslighting': [
            r'\b(you\'?re (crazy|insane|paranoid|overreacting))\b',
            r'\b(that never happened|you\'?re imagining)\b',
            r'\b(too sensitive|dramatic|emotional)\b',
            r'\b(you\'?re making (this|that) up)\b',
            r'\b(stop being so|can\'?t you take a joke)\b',
        ],
        'coercion': [
            r'\b(send me|show me|give me).*(photo|picture|video|nude|pic)',
            r'\b(do (this|it) or (i\'?ll|else))\b',
            r'\b(you (have to|must|need to|better))',
            r'\b(i\'?ll (share|post|tell everyone|expose))\b',
            r'\b(if you don\'?t.*i\'?ll)\b',
        ],
        'stalking': [
            r'\b(i know where|i\'?m watching|following you)\b',
            r'\b(i (saw|see) you (at|in|near))\b',
            r'\b(been (tracking|monitoring|watching) you)\b',
            r'\b(know your (schedule|routine|location))\b',
        ],
        'emotional_manipulation': [
            r'\b(it\'?s your fault|you made me)\b',
            r'\b(after all i\'?ve done|you owe me)\b',
            r'\b(if you (loved|cared))\b',
            r'\b(you\'?ll regret|you\'?re making me)\b',
            r'\b((was|were) (only|just) joking)\b',
        ]
    }
    
    SAFE_RESPONSES = {
        'threats': "⚠️ URGENT: This message contains threatening language. Consider documenting this and contacting authorities immediately.",
        'harassment': "This is verbal abuse. You don't deserve this treatment. Consider limiting contact and seeking support.",
        'gaslighting': "This appears to be gaslighting. Trust your instincts and keep records of conversations.",
        'coercion': "This is coercive behavior. You are never obligated to comply with demands. Document and consider blocking.",
        'stalking': "⚠️ This suggests stalking. Document all messages and report to law enforcement immediately.",
        'emotional_manipulation': "This is emotional manipulation. You are not responsible for others' behavior. Set firm boundaries."
    }
    
    SEVERITY_MAP = {
        'threats': 0.95,
        'stalking': 0.90,
        'coercion': 0.85,
        'harassment': 0.75,
        'gaslighting': 0.70,
        'emotional_manipulation': 0.65
    }
    
    @classmethod
    def analyze(cls, text):
        if not text or not isinstance(text, str):
            return {
                'harmful': False,
                'severity': 0,
                'types': [],
                'safe_response': 'Invalid input.'
            }
        
        text_lower = text.lower()
        detected_types = []
        max_severity = 0
        
        for abuse_type, patterns in cls.PATTERNS.items():
            for pattern in patterns:
                try:
                    if re.search(pattern, text_lower, re.IGNORECASE):
                        if abuse_type not in detected_types:
                            detected_types.append(abuse_type)
                        break
                except re.error:
                    continue
        
        if detected_types:
            for abuse_type in detected_types:
                severity = cls.SEVERITY_MAP.get(abuse_type, 0.5)
                max_severity = max(max_severity, severity)
            
            if len(detected_types) > 1:
                max_severity = min(0.99, max_severity + (len(detected_types) - 1) * 0.05)
        
        harmful = len(detected_types) > 0
        primary_type = detected_types[0] if detected_types else 'general'
        
        return {
            'harmful': harmful,
            'severity': round(max_severity, 2) if harmful else 0,
            'types': detected_types,
            'safe_response': cls.SAFE_RESPONSES.get(primary_type, 'This message appears safe.')
        }
