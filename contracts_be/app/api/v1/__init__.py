"""
API v1 Blueprint Package
"""
from flask import Blueprint

api_v1_bp = Blueprint("api_v1", __name__)

# Register all route modules
from . import auth        # noqa: F401, E402
from . import contracts   # noqa: F401, E402
from . import tenders     # noqa: F401, E402
from . import vendors     # noqa: F401, E402
from . import invoices    # noqa: F401, E402
from . import payments    # noqa: F401, E402
from . import sla         # noqa: F401, E402
from . import workflow    # noqa: F401, E402
from . import documents   # noqa: F401, E402
from . import notes       # noqa: F401, E402
from . import dashboard   # noqa: F401, E402
from . import search      # noqa: F401, E402
from . import reports     # noqa: F401, E402
from . import notifications  # noqa: F401, E402
from . import admin       # noqa: F401, E402
from . import awards      # noqa: F401, E402
