# Data Generation Prompts

This document contains ready-to-use prompts for generating synthetic counseling data. Copy and paste each prompt into your AI model to generate the corresponding dataset.

---

## Prompt 1: Kinyarwanda Training Data

**Use this prompt to generate:** `kinyarwanda_counseling.train.jsonl`

```
You are a good translator and expert in sex education and mental health for young girls and your task is to generate synthetic data that can be used in pre-training the model so that it will work efficiently and also give good Kinyarwanda answers since we are designing it for rural areas where no experts are found. 

This is the range of topics to cover:
COUNSELING_TOPICS = [
    # Sex Education Topics
    ("menstrual health", "A young girl asking about her first period, what to expect, and how to manage it", "sex-education"),
    ("reproductive health basics", "A young girl asking about how her body changes during puberty", "sex-education"),
    ("body changes during puberty", "A young girl confused about physical changes happening to her body", "sex-education"),
    ("hygiene during menstruation", "A young girl asking about proper hygiene practices during her period", "sex-education"),
    ("understanding consent", "A young girl asking what consent means and how to recognize it", "sex-education"),
    ("healthy relationships", "A young girl asking about what makes a healthy relationship with peers", "sex-education"),
    ("peer pressure", "A young girl feeling pressured by friends to do something she's uncomfortable with", "sex-education"),
    ("body image and self-acceptance", "A young girl struggling with how she looks and comparing herself to others", "sex-education"),
    
    # Self-Protection Topics
    ("personal safety", "A young girl asking how to stay safe when walking alone or in public places", "self-protection"),
    ("recognizing inappropriate behavior", "A young girl asking how to know if someone's behavior towards her is wrong", "self-protection"),
    ("saying no and setting boundaries", "A young girl asking how to say no when she feels uncomfortable", "self-protection"),
    ("trusted adults and seeking help", "A young girl asking who she can talk to if something bad happens", "self-protection"),
    ("online safety", "A young girl asking about staying safe on the internet and social media", "self-protection"),
    ("protecting personal information", "A young girl asking what personal information she should not share", "self-protection"),
    ("handling unwanted attention", "A young girl asking what to do when someone gives her unwanted attention", "self-protection"),
    ("safe spaces and safe people", "A young girl asking how to identify safe places and people", "self-protection"),
    
    # Mental Health Awareness Topics
    ("anxiety and worry", "A young girl experiencing constant worry and fear about school or social situations", "mental-health"),
    ("depression and sadness", "A young girl feeling sad, hopeless, and losing interest in activities she used to enjoy", "mental-health"),
    ("stress management", "A young girl feeling overwhelmed with school, family, or social pressures", "mental-health"),
    ("self-esteem and confidence", "A young girl struggling with low self-confidence and self-worth", "mental-health"),
    ("emotional regulation", "A young girl having difficulty managing her emotions and reactions", "mental-health"),
    ("coping with change", "A young girl struggling to adapt to changes in her life or family", "mental-health"),
    ("self-care practices", "A young girl asking how to take care of her mental and emotional well-being", "mental-health"),
    ("dealing with bullying", "A young girl experiencing bullying at school or online", "mental-health"),
    ("loneliness and isolation", "A young girl feeling isolated and disconnected from others", "mental-health"),
    ("communication skills", "A young girl having difficulty expressing her feelings and needs", "mental-health"),
    ("coping with trauma", "A young girl who has experienced a traumatic event and needs support", "mental-health"),
    ("building resilience", "A young girl asking how to become stronger and bounce back from difficulties", "mental-health"),
]

Generate at least 3,000-4,000 examples. For each topic, create multiple variants with different variant numbers (1, 2, 3, etc.). Each example should be a complete JSON object on a single line in JSONL format (one JSON per line, no commas between objects, no array wrapper).

Output format for each example:
{"topic": "menstrual health", "scenario": "A young girl asking about her first period, what to expect, and how to manage it", "variant": 48, "instruction": "Ni iki igihe cyanjye cy'ukwezi cya mbere, ni iki nkwiye kumenya no gukora?", "output": "Igihe cy'ukwezi (imihango) ni amaraso asohoka mu gitsina cy'umukobwa buri kwezi, ni ibisanzwe kandi ntibivuze ko urwaye. Ushobora kumva ufite ububabare mu nda cyangwa mu mugongo, ariko iyo bibabaza cyane ushobora kubwira umubyeyi, umwarimu cyangwa umukozi w'ubuzima. Koresha udutambaro tw'isuku cyangwa pads zisukuye, uzihindure kenshi kugira ngo utandura. Jya wikaraba neza n'amazi meza n'isabune, unafate umwanya wo kuruhuka no kunywa amazi ahagije. Niba amaraso arenze ibisanzwe, akamara iminsi myinshi cyane, cyangwa ukagira umutima uhora uhangayitse, ni byiza kuganira n'umuganga. ", "language": "kinyarwanda", "domain": "sex-education"}

Important requirements:
- All instruction and output text must be in natural, fluent Kinyarwanda
- Use age-appropriate language for girls aged 10-18
- Responses should be supportive, informative, culturally appropriate, and non-judgmental
- Each JSON object must be on a single line
- No blank lines between JSON objects
- No trailing commas
- Ensure all required fields are present: topic, scenario, variant, instruction, output, language, domain
```

---

## Prompt 2: English Training Data

**Use this prompt to generate:** `english_counseling.train.jsonl`

```
You are an expert in sex education and mental health for young girls and your task is to generate synthetic data that can be used in pre-training the model so that it will work efficiently and also give good English answers since we are designing it for rural areas where no experts are found.

This is the range of topics to cover:
COUNSELING_TOPICS = [
    # Sex Education Topics
    ("menstrual health", "A young girl asking about her first period, what to expect, and how to manage it", "sex-education"),
    ("reproductive health basics", "A young girl asking about how her body changes during puberty", "sex-education"),
    ("body changes during puberty", "A young girl confused about physical changes happening to her body", "sex-education"),
    ("hygiene during menstruation", "A young girl asking about proper hygiene practices during her period", "sex-education"),
    ("understanding consent", "A young girl asking what consent means and how to recognize it", "sex-education"),
    ("healthy relationships", "A young girl asking about what makes a healthy relationship with peers", "sex-education"),
    ("peer pressure", "A young girl feeling pressured by friends to do something she's uncomfortable with", "sex-education"),
    ("body image and self-acceptance", "A young girl struggling with how she looks and comparing herself to others", "sex-education"),
    
    # Self-Protection Topics
    ("personal safety", "A young girl asking how to stay safe when walking alone or in public places", "self-protection"),
    ("recognizing inappropriate behavior", "A young girl asking how to know if someone's behavior towards her is wrong", "self-protection"),
    ("saying no and setting boundaries", "A young girl asking how to say no when she feels uncomfortable", "self-protection"),
    ("trusted adults and seeking help", "A young girl asking who she can talk to if something bad happens", "self-protection"),
    ("online safety", "A young girl asking about staying safe on the internet and social media", "self-protection"),
    ("protecting personal information", "A young girl asking what personal information she should not share", "self-protection"),
    ("handling unwanted attention", "A young girl asking what to do when someone gives her unwanted attention", "self-protection"),
    ("safe spaces and safe people", "A young girl asking how to identify safe places and people", "self-protection"),
    
    # Mental Health Awareness Topics
    ("anxiety and worry", "A young girl experiencing constant worry and fear about school or social situations", "mental-health"),
    ("depression and sadness", "A young girl feeling sad, hopeless, and losing interest in activities she used to enjoy", "mental-health"),
    ("stress management", "A young girl feeling overwhelmed with school, family, or social pressures", "mental-health"),
    ("self-esteem and confidence", "A young girl struggling with low self-confidence and self-worth", "mental-health"),
    ("emotional regulation", "A young girl having difficulty managing her emotions and reactions", "mental-health"),
    ("coping with change", "A young girl struggling to adapt to changes in her life or family", "mental-health"),
    ("self-care practices", "A young girl asking how to take care of her mental and emotional well-being", "mental-health"),
    ("dealing with bullying", "A young girl experiencing bullying at school or online", "mental-health"),
    ("loneliness and isolation", "A young girl feeling isolated and disconnected from others", "mental-health"),
    ("communication skills", "A young girl having difficulty expressing her feelings and needs", "mental-health"),
    ("coping with trauma", "A young girl who has experienced a traumatic event and needs support", "mental-health"),
    ("building resilience", "A young girl asking how to become stronger and bounce back from difficulties", "mental-health"),
]

Generate at least 3,000-4,000 examples. Create diverse questions and scenarios for each topic. Each example should be a complete JSON object on a single line in JSONL format (one JSON per line, no commas between objects, no array wrapper).

Output format for each example:
{"instruction": "My period just started, is this normal?", "output": "Yes, getting your period is completely normal! Most girls start between ages 9-16. Your period means your body is maturing. It typically lasts 3-7 days and comes about once a month. You might experience cramping, mood changes, or tiredness - all normal. Use sanitary pads and change them every 3-4 hours. If you have severe pain, very heavy bleeding, or periods lasting more than 7 days, talk to a healthcare provider. Remember, every girl's experience is different, and it's okay to ask questions!", "topic": "menstrual health", "domain": "sex-education", "language": "english"}

Important requirements:
- All instruction and output text must be in natural, fluent English
- Use age-appropriate language for girls aged 10-18
- Responses should be supportive, informative, culturally sensitive, and non-judgmental
- Each JSON object must be on a single line
- No blank lines between JSON objects
- No trailing commas
- Ensure all required fields are present: instruction, output, topic, domain, language
- Note: English format does NOT include "scenario" or "variant" fields
```

---

## Prompt 3: Kinyarwanda Validation Data

**Use this prompt to generate:** `kinyarwanda_counseling.validation.jsonl`

```
You are a good translator and expert in sex education and mental health for young girls and your task is to generate synthetic validation data that can be used to evaluate the model's performance. Generate good Kinyarwanda answers since we are designing it for rural areas where no experts are found.

This is the range of topics to cover:
COUNSELING_TOPICS = [
    # Sex Education Topics
    ("menstrual health", "A young girl asking about her first period, what to expect, and how to manage it", "sex-education"),
    ("reproductive health basics", "A young girl asking about how her body changes during puberty", "sex-education"),
    ("body changes during puberty", "A young girl confused about physical changes happening to her body", "sex-education"),
    ("hygiene during menstruation", "A young girl asking about proper hygiene practices during her period", "sex-education"),
    ("understanding consent", "A young girl asking what consent means and how to recognize it", "sex-education"),
    ("healthy relationships", "A young girl asking about what makes a healthy relationship with peers", "sex-education"),
    ("peer pressure", "A young girl feeling pressured by friends to do something she's uncomfortable with", "sex-education"),
    ("body image and self-acceptance", "A young girl struggling with how she looks and comparing herself to others", "sex-education"),
    
    # Self-Protection Topics
    ("personal safety", "A young girl asking how to stay safe when walking alone or in public places", "self-protection"),
    ("recognizing inappropriate behavior", "A young girl asking how to know if someone's behavior towards her is wrong", "self-protection"),
    ("saying no and setting boundaries", "A young girl asking how to say no when she feels uncomfortable", "self-protection"),
    ("trusted adults and seeking help", "A young girl asking who she can talk to if something bad happens", "self-protection"),
    ("online safety", "A young girl asking about staying safe on the internet and social media", "self-protection"),
    ("protecting personal information", "A young girl asking what personal information she should not share", "self-protection"),
    ("handling unwanted attention", "A young girl asking what to do when someone gives her unwanted attention", "self-protection"),
    ("safe spaces and safe people", "A young girl asking how to identify safe places and people", "self-protection"),
    
    # Mental Health Awareness Topics
    ("anxiety and worry", "A young girl experiencing constant worry and fear about school or social situations", "mental-health"),
    ("depression and sadness", "A young girl feeling sad, hopeless, and losing interest in activities she used to enjoy", "mental-health"),
    ("stress management", "A young girl feeling overwhelmed with school, family, or social pressures", "mental-health"),
    ("self-esteem and confidence", "A young girl struggling with low self-confidence and self-worth", "mental-health"),
    ("emotional regulation", "A young girl having difficulty managing her emotions and reactions", "mental-health"),
    ("coping with change", "A young girl struggling to adapt to changes in her life or family", "mental-health"),
    ("self-care practices", "A young girl asking how to take care of her mental and emotional well-being", "mental-health"),
    ("dealing with bullying", "A young girl experiencing bullying at school or online", "mental-health"),
    ("loneliness and isolation", "A young girl feeling isolated and disconnected from others", "mental-health"),
    ("communication skills", "A young girl having difficulty expressing her feelings and needs", "mental-health"),
    ("coping with trauma", "A young girl who has experienced a traumatic event and needs support", "mental-health"),
    ("building resilience", "A young girl asking how to become stronger and bounce back from difficulties", "mental-health"),
]

Generate 100-200 high-quality validation examples. These should be distinct from training examples and cover all topics. Use different scenarios and variant numbers than those used in training. Each example should be a complete JSON object on a single line in JSONL format (one JSON per line, no commas between objects, no array wrapper).

Output format for each example:
{"topic": "emotional regulation", "scenario": "A young girl having difficulty managing her emotions and reactions", "variant": 17, "instruction": "Nshaka kumenya gukuraho imyifatire. Wansobanura neza?", "output": "Ni byiza kumenya ukwihangana neza kandi wihangane. Gukuraho imyifatire ni ikintu gisanzwe kandi gisanzwe mu buzima. Ni byiza kumenya gukuraho imyifatire. Wakora neza kandi wihangane mu buzima. Ni byiza kuvugana n'ababyeyi cyangwa abakozi b'ubuzima niba ufite ikibazo cyangwa ubwoba. Wakora neza kandi wihangane.", "language": "kinyarwanda", "domain": "mental-health"}

Important requirements:
- All instruction and output text must be in natural, fluent Kinyarwanda
- Use age-appropriate language for girls aged 10-18
- Responses should be supportive, informative, culturally appropriate, and non-judgmental
- Each JSON object must be on a single line
- No blank lines between JSON objects
- No trailing commas
- Ensure all required fields are present: topic, scenario, variant, instruction, output, language, domain
- Use variant numbers that are different from training data (e.g., start from variant 100+ or use different numbering scheme)
- Ensure examples are distinct and not duplicates of training data
```

---

## Prompt 4: English Validation Data

**Use this prompt to generate:** `english_counseling.validation.jsonl`

```
You are an expert in sex education and mental health for young girls and your task is to generate synthetic validation data that can be used to evaluate the model's performance. Generate good English answers since we are designing it for rural areas where no experts are found.

This is the range of topics to cover:
COUNSELING_TOPICS = [
    # Sex Education Topics
    ("menstrual health", "A young girl asking about her first period, what to expect, and how to manage it", "sex-education"),
    ("reproductive health basics", "A young girl asking about how her body changes during puberty", "sex-education"),
    ("body changes during puberty", "A young girl confused about physical changes happening to her body", "sex-education"),
    ("hygiene during menstruation", "A young girl asking about proper hygiene practices during her period", "sex-education"),
    ("understanding consent", "A young girl asking what consent means and how to recognize it", "sex-education"),
    ("healthy relationships", "A young girl asking about what makes a healthy relationship with peers", "sex-education"),
    ("peer pressure", "A young girl feeling pressured by friends to do something she's uncomfortable with", "sex-education"),
    ("body image and self-acceptance", "A young girl struggling with how she looks and comparing herself to others", "sex-education"),
    
    # Self-Protection Topics
    ("personal safety", "A young girl asking how to stay safe when walking alone or in public places", "self-protection"),
    ("recognizing inappropriate behavior", "A young girl asking how to know if someone's behavior towards her is wrong", "self-protection"),
    ("saying no and setting boundaries", "A young girl asking how to say no when she feels uncomfortable", "self-protection"),
    ("trusted adults and seeking help", "A young girl asking who she can talk to if something bad happens", "self-protection"),
    ("online safety", "A young girl asking about staying safe on the internet and social media", "self-protection"),
    ("protecting personal information", "A young girl asking what personal information she should not share", "self-protection"),
    ("handling unwanted attention", "A young girl asking what to do when someone gives her unwanted attention", "self-protection"),
    ("safe spaces and safe people", "A young girl asking how to identify safe places and people", "self-protection"),
    
    # Mental Health Awareness Topics
    ("anxiety and worry", "A young girl experiencing constant worry and fear about school or social situations", "mental-health"),
    ("depression and sadness", "A young girl feeling sad, hopeless, and losing interest in activities she used to enjoy", "mental-health"),
    ("stress management", "A young girl feeling overwhelmed with school, family, or social pressures", "mental-health"),
    ("self-esteem and confidence", "A young girl struggling with low self-confidence and self-worth", "mental-health"),
    ("emotional regulation", "A young girl having difficulty managing her emotions and reactions", "mental-health"),
    ("coping with change", "A young girl struggling to adapt to changes in her life or family", "mental-health"),
    ("self-care practices", "A young girl asking how to take care of her mental and emotional well-being", "mental-health"),
    ("dealing with bullying", "A young girl experiencing bullying at school or online", "mental-health"),
    ("loneliness and isolation", "A young girl feeling isolated and disconnected from others", "mental-health"),
    ("communication skills", "A young girl having difficulty expressing her feelings and needs", "mental-health"),
    ("coping with trauma", "A young girl who has experienced a traumatic event and needs support", "mental-health"),
    ("building resilience", "A young girl asking how to become stronger and bounce back from difficulties", "mental-health"),
]

Generate 100-200 high-quality validation examples. These should be distinct from training examples and cover all topics. Use different questions and scenarios than those used in training. Each example should be a complete JSON object on a single line in JSONL format (one JSON per line, no commas between objects, no array wrapper).

Output format for each example:
{"instruction": "I am feeling pressured by my friends to do things I don't want to do.", "output": "Peer pressure can be really hard to deal with. It's important to remember that true friends will respect your decisions and boundaries. You have the right to say 'no' to anything that makes you uncomfortable or goes against your values. Try saying something like, 'I'm not comfortable with that' or 'No thanks, I'm not interested.' If they keep pushing, it might be time to distance yourself from them. Surround yourself with people who support you and make you feel good about yourself. You can also talk to a trusted adult about what's happening.", "topic": "peer pressure", "domain": "social-behavior", "language": "english"}

Important requirements:
- All instruction and output text must be in natural, fluent English
- Use age-appropriate language for girls aged 10-18
- Responses should be supportive, informative, culturally sensitive, and non-judgmental
- Each JSON object must be on a single line
- No blank lines between JSON objects
- No trailing commas
- Ensure all required fields are present: instruction, output, topic, domain, language
- Note: English format does NOT include "scenario" or "variant" fields
- Ensure examples are distinct and not duplicates of training data
```

---

## How to Use These Prompts

1. **Copy the appropriate prompt** (1, 2, 3, or 4) based on which dataset you want to generate
2. **Paste it into your AI model** (ChatGPT, Claude, or any other model)
3. **Wait for generation** - the model will output JSONL formatted data
4. **Save the output** to the corresponding file:
   - Prompt 1 → `kinyarwanda_counseling.train.jsonl`
   - Prompt 2 → `english_counseling.train.jsonl`
   - Prompt 3 → `kinyarwanda_counseling.validation.jsonl`
   - Prompt 4 → `english_counseling.validation.jsonl`
5. **Validate the format** - ensure each line is valid JSON and the file is in JSONL format (not a JSON array)

## Format Validation

After generation, you can validate the format using this Python code:

```python
import json

def validate_jsonl(file_path):
    """Validate that a file is properly formatted JSONL"""
    with open(file_path, 'r', encoding='utf-8') as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:  # Skip blank lines
                continue
            try:
                data = json.loads(line)
                print(f"Line {line_num}: ✓ Valid")
            except json.JSONDecodeError as e:
                print(f"Line {line_num}: ✗ Error - {e}")
                return False
    print(f"✓ {file_path} is valid JSONL")
    return True

# Validate all files
validate_jsonl("kinyarwanda_counseling.train.jsonl")
validate_jsonl("english_counseling.train.jsonl")
validate_jsonl("kinyarwanda_counseling.validation.jsonl")
validate_jsonl("english_counseling.validation.jsonl")
```

