import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export function TableBoard({ tabHeader, data, renderActions }) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        background: "#f4f8ffff",
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.25)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        maxHeight: 350,
        overflowY: "auto",
        backdropFilter: "blur(12px)",

        /* Scrollbar discret */
        "&::-webkit-scrollbar": {
          width: "0px",
        },
        "&:hover::-webkit-scrollbar": {
          width: "6px",
          backgroundColor:"#76aaaa"
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(255,255,255,0.35)",
          borderRadius: "10px",
        },
      }}
    >
      <Table stickyHeader>
        {/* HEADER */}
        <TableHead>
          <TableRow>
            {tabHeader.map((col, i) => (
              <TableCell
                key={i}
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                  background: "rgba(233, 233, 233, 0.99)",
                     //"linear-gradient(135deg, #c0d1d3ff, #edf5f8ff)",
                  color: "#3c5d5dff",
                  fontWeight: 600,
                  fontSize: 12,
                  borderBottom: "2px solid #76acac7e",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* BODY */}
        <TableBody>
          {data.map((row, i) => (
            <TableRow
              key={i}
              sx={{
                transition: "background 0.25s ease",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.25)",
                },
              }}
            >
              {tabHeader.map((col, j) => (
                <TableCell
                  key={j}
                  sx={{
                    color: "#262626ea",
                    fontSize: 13,
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                  }}
                >
                  {col.key === "actions"
                    ? renderActions?.(row)
                    : row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
