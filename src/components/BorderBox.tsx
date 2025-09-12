import { clsx } from 'clsx';
import { Children } from 'react';

function BorderBox({ borderColor, children }) {

  return (
    <div
      className={clsx("border border-solid", {
        "border-black": borderColor === "black",
        "border-red-500": borderColor === "red",
        "border-green-500": borderColor === "green",
      })}
    >
      {children}
    </div>
  );

}
export default BorderBox

