# Copyright 2020 Google LLC

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#     https://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
def strip_shacl_prefix(url: str) -> str:
    """Strip the shacl prefix and return value of the url.

    Args:
        url (str): String with shacl prefix.

    Returns:
        str: String after removing shacl prefix..
    """
    term = str(url)
    return term[27:]


def strip_url(url: str) -> str:
    """Strip the url and return value of the url.

    Args:
        url (str): URL.

    Returns:
        str: The last term of the url.
    """
    term = str(url)
    return term.split('/')[-1]


class ResultRow():
    """The ResultRow holds the details of a single issue that causes validation
    error.

    Attributes:
        id (str): Identfier of the outermost entity that caused the validation
                  error.
        message (str): The message indicating the cause of error.
        property_path (str): The path to the source of error.
        value (str): The value of attribute that caused error.
        severity (str): The severity of error.
    """

    def __init__(self,
                 id: str,
                 message: str,
                 property_path: str,
                 value: str,
                 severity: str):
        self.id = id
        self.message = message
        self.property_path = property_path
        self.value = value
        self.severity = severity

    def __eq__(self, other):
        return ((self.id == other.id)
                and (self.message == other.message)
                and (self.property_path == other.property_path)
                and (self.value == other.value)
                and (self.severity == other.severity)
                )
