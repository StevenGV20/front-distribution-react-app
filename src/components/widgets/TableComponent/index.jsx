import React from "react";

export default function TableCustom({
  cols,
  children,
  mini = false,
  maxHeight = 75,
  spacing = true,
  refDiv = null
}) {
  const numColumns = () => {
    let numColumns = 0;
    if (typeof cols[0] === "object") {
      cols.forEach(function (col) {
        numColumns += col.colSpan;
      });
    } else {
      numColumns = cols.length;
    }
    ////console.log(numColumns);
    return numColumns;
  };

  return (
    <div
      className="table-container-content"
      style={{ maxHeight: `${maxHeight}vh` }}
      ref={refDiv}
    >
      <table
        className={`table-container-tb ${
          spacing && "table-container-tb-spacing"
        } ${spacing && mini && "table-container-tb-spacing-mini"}`}
      >
        <thead className="table-container-thead z-50">
          <tr>
            {cols &&
              cols.map((col, index) => (
                <th
                  scope="col"
                  key={index}
                  className={`table-container-th z-50 ${
                    mini && "table-container-th-mini"
                  }`}
                >
                  {col}
                </th>
              ))}
          </tr>
        </thead>
        <tbody
          className={`table-container-tbody ${
            mini && "table-container-tbody-mini"
          }`}
        >
          {children}
        </tbody>
      </table>
    </div>
  );
}
