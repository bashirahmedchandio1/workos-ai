from mcp.server import Server


mcp = Server("Google Sheets Connector")


@mcp.tool()
async def append_row(spreadsheet_id: str, range: str, values: list[list]) -> dict:
    """Append a row to a Google Sheet."""
    return {"status": "appended", "spreadsheet_id": spreadsheet_id, "range": range, "updated_rows": 1}


@mcp.tool()
async def update_cell(spreadsheet_id: str, range: str, value: str) -> dict:
    """Update a cell value in a Google Sheet."""
    return {"status": "updated", "spreadsheet_id": spreadsheet_id, "range": range}


@mcp.tool()
async def get_sheet_data(spreadsheet_id: str, range: str) -> dict:
    """Read data from a Google Sheet."""
    return {"spreadsheet_id": spreadsheet_id, "range": range, "values": [["Header1", "Header2"], ["val1", "val2"]]}
