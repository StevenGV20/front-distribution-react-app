import React, { Fragment} from "react";
import { IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Menu, Transition } from "@headlessui/react";

const TableCollapseCustom2Component = ({
  children,
  subtable,
  titleSubTable,
  cols,
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Menu as={Fragment}>
      <tr>
        {children}
        <td>
          <Menu.Button>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Menu.Button>
        </td>
      </tr>
      <Transition
        show={open}
        as={Fragment}
        enter="transition ease-out duration-100 max-h-0"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75 max-h-full"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items as={Fragment}>
          <tr className={`p-4`}>
            <td colSpan={cols.length} className="w-full text-left">
              <div className="py-4 px-8">
                <div className="w-full text-left">{titleSubTable}</div>
                <div>{subtable}</div>
              </div>
            </td>
          </tr>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default TableCollapseCustom2Component;
