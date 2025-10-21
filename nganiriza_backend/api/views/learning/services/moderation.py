from dataclasses import dataclass


@dataclass
class SafetyVerdict:
    allowed: bool
    flags: dict
    action: str

def moderate_message(message: str) -> SafetyVerdict:
    lowered = message.lower()
    flags = {}

    # keywords for simple content moderation
    banned_words = ['spam', 'violence', 'abuse']
    for word in banned_words:
        if word in lowered:
            flags[word] = True

    # Decide allowed/action based on any flags found
    if flags:
        return SafetyVerdict(allowed=False, flags=flags, action='block')
    return SafetyVerdict(allowed=True, flags={}, action='')