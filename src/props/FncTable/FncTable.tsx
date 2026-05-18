import TitleText from "../TitleText/TitleText";
import "./FncTableStyle.css";

export interface FncTableColumn {
  header: string;
  key: string;
  colorKey?: string;
}

interface FncTableProps<T> {
  title?: string;
  data: T[];
  columns: FncTableColumn[];
  onRowClick?: (row: T) => void; // Nova prop para o evento de clique
}

const FncTable = <T extends Record<string, any>>({
  title,
  data = [],
  columns = [],
  onRowClick,
}: FncTableProps<T>) => {
  return (
    <>
      <div className="fnc-ctn-table">
        {title && <TitleText text={title} />}
        <div className="fnc-table-invite-wrapper">
          <table>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col.header.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    onClick={() => onRowClick && onRowClick(row)} // Dispara o evento se existir
                    style={{ cursor: onRowClick ? "pointer" : "default" }} // Muda o cursor se for clicável
                  >
                    {columns.map((col, colIndex) => {
                      const value = row[col.key];
                      const color = col.colorKey
                        ? row[col.colorKey]
                        : undefined;

                      return (
                        <td key={colIndex} style={{ color: color }}>
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: "center" }}>
                    Nenhum dado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FncTable;
