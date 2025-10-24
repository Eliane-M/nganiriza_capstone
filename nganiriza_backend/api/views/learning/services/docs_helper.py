from drf_spectacular.utils import extend_schema

def api_doc(tag, **kwargs):
    return extend_schema(tags=[tag], **kwargs)