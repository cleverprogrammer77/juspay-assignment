import React, { useEffect, useState, useContext } from "react";
import { useDrop } from "react-dnd";
import Blockcopy from "./Blockcopy";
import { Reorder, useDragControls, useVelocity } from "framer-motion";
import ControlBlocks from "./ControlBlocks";
import Context from "./Context";

export default function MidArea(props) {
  const [keyVal, setKeyVal] = useContext(Context);

  const [board, setBoard] = useState([]);

  let count = 0;

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Delete") {
        setBoard((prv) => {
          let newArr;
          if (keyVal < 1000) {
            prv = prv.filter((object) => {
              return object.key !== keyVal;
            });
          } else {
            let prekey = Math.round(keyVal / 1000);
            newArr = prv;
            const ind = prv.findIndex((object) => {
              return object.key === prekey;
            });
            newArr = prv[ind].array.filter((object) => {
              return object.key !== keyVal;
            });
            prv[ind].array = newArr;
            return [...prv];
          }
          return [...prv];
        });
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [keyVal]);

  useEffect(() => {
    let flowAdding = [];

    for (let i = 0; i < board.length; i++) {
      // console.log(board[i]);

      flowAdding.push({
        onTap: board[i].onTap,
        action: board[i].action,
        array: board[i].array,
        repeat: board[i].repeat,
      });
    }
    props.setFlow(flowAdding);
  }, [board]);

  const [{ isOver, isOverCurrent }, drop] = useDrop(() => ({
    accept: ["insert", "replace", "insertinto", "replaceinto"],
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }

      addImageToBoard(item.props);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  }));

  const addImageToBoard = (ite) => {
    // console.log(ite)
    const temp = {
      id: ite.id,
      class: ite.class,
      operation: ite.operation,
      action: ite.item.action,
      onTap: ite.item.onTap,
      type: ite.type,
      array: ite.item.array,
      repeat: ite.item.repeat,
    };
    count += 1;
    setBoard((prv) => {
      // console.log(keycount)

      return [...prv, { ...temp, key: count }];
    });
  };

  return (
    <div
      ref={drop}
      className="w-3/6 flex-none h-full  overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200 text-600 text-2xl font-bold p-10"
    >
      {"Drop your Code"}

      <Reorder.Group
        axis={"y" || "x"}
        values={board}
        id="midarea"
        className="mx-4 text-lg flex-row  py-4 -space-y-2"
        onReorder={setBoard}
      >
        {board.map((item) => (
          <Reorder.Item drag key={item.key} value={item}>
            {item.type === "insertinto" && (
              <ControlBlocks
                id={item.key}
                draggable
                class={`text-lg items-start p-4 ${item.class}`}
                operation={item.operation}
                setFlow={props.setFlow}
                type={"replace"}
                flow={props.flow}
                board={board}
                setBoard={setBoard}
              />
            )}
            {item.type === "insert" && (
              <Blockcopy
                id={item.key}
                class={`text-lg items-center p-2 ${item.class}`}
                operation={item.operation}
                setFlow={props.setFlow}
                action={item.action}
                type={"replace"}
                setBoard={setBoard}
              >
                {item.type}
              </Blockcopy>
            )}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
