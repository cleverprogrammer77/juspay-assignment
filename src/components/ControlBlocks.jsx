import React from "react";
import Blockcopy from "./Blockcopy";
import { useDrag, useDrop } from "react-dnd";
import { useState, useEffect, useContext } from "react";
import { Reorder, useDragControls } from "framer-motion";
import Context from "./Context";

function ControlBlock(props) {
  const [keyVal, setKeyVal] = useContext(Context);

  const [innerBlock, setInnerBlock] = useState([]);
  let count = 1;

  useEffect(() => {
    let inner = [];

    for (let i = 0; i < innerBlock.length; i++) {
      inner.push({
        onTap: innerBlock[i].onTap,
        action: innerBlock[i].action,
        key: innerBlock[i].key,
      });
    }

    props.setBoard((prv) => {
      const index = prv.findIndex((object) => {
        return object.key === props.id;
      });
      // console.log("innerbox, board", index, prv)

      prv[index].array = inner;

      return [...prv];
    });
    // setInnerBlock(inner)
    // console.log(innerBlocks, innerBlock)
  }, [innerBlock]);

  const [{ isOver }, dropE] = useDrop(() => ({
    accept: ["insert", "replace", "replaceinto"],
    drop: (item) => addImageToBoard(item.props),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addImageToBoard = (ite) => {
    // console.log(ite)
    const temp = {
      id: ite.id,
      class: ite.class,
      operation: ite.operation,
      action: ite.item.action,
      onTap: ite.onTap,
      type: ite.type,
      array: ite.item.array,
    };
    count += 1;

    setInnerBlock((prv) => {
      // console.log(temp)
      return [...prv, { ...temp, key: props.id * 1000 + count }];
    });

    // const index = props.flow.findIndex(object => {
    //   return object.id === props.id;
    // });

    // props.setFlow((prv) => {
    //   // console,log(prv)
    //   // console.log(props.id, "propsid", props.flow)
    //   // prv[index].array  =  innerBlock
    //   return (prv)
    // })
  };

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Delete") {
        if (keyVal > 1000) {
          setInnerBlock((prv) => {
            let newArr = prv.filter((object) => {
              return object.key !== keyVal;
            });
            return [...newArr];
          });
        }
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [keyVal]);

  function handleChange(event) {
    const value = Number(event.target.value.replace(/\D/g, ""));
    console.log(value);

    props.setBoard((prv) => {
      const index = prv.findIndex((object) => {
        return object.key === props.id;
      });

      prv[index].repeat = value;
      console.log(prv[index], props.id, index);

      // console.log(prv[index].action)
      return [...prv];
    });
  }

  return (
    <div
      ref={dropE}
      className={`${props.class} items-end rounded-lg border-2`}
      onClick={() => {
        {
          setKeyVal(props.id);
        }
        // console.log(keyVal)
      }}
    >
      {props.operation} {props.id}
      <input
        onChange={handleChange}
        defaultValue={5}
        type="text"
        className="text-blue-900 justify-items-end text-lg w-16 h-5 mx-6 p-4 rounded-lg"
      ></input>
      <Reorder.Group axis="y" values={innerBlock} onReorder={setInnerBlock}>
        {innerBlock.map((item) => (
          <Reorder.Item
            key={item.key}
            value={item}
            drag
            className="mx-4  flex-row  content-center"
          >
            <Blockcopy
              id={item.key}
              class={`text-m items-center  ${item.class}`}
              operation={item.operation}
              setFlow={props.setFlow}
              type={"replaceinto"}
              action={item.action}
              setInnerBlock={setInnerBlock}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}

export default ControlBlock;
