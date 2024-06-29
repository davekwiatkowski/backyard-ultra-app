import base64


def decode_string(value: str):
    base64_decoded_string = base64.b64decode(value)
    return base64_decoded_string.decode("utf-8")


def encode_string(value: str):
    return base64.b64encode(value.encode("utf-8"))
