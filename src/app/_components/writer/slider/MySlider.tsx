"use client";

import React, { useState } from "react";
import { ConfigProvider, InputNumberProps } from "antd";
import { Col, Row, Slider } from "antd";

const IntegerStep: React.FC = () => {
  const [inputValue, setInputValue] = useState(1);

  const onChange: InputNumberProps["onChange"] = (newValue) => {
    setInputValue(newValue as number);
  };

  return (
    <div>
      <Row>
        <Col span={24}>
          <Slider
            className={"mr-18.7025"}
            min={0}
            max={70}
            onChange={onChange}
            value={typeof inputValue === "number" ? inputValue : 0}
          />
        </Col>
      </Row>
      <Row className="mr-18.7025 flex justify-between">
        <Col>
          <span>0%</span>
        </Col>
        <Col>
          <span>{inputValue}%</span>
        </Col>
      </Row>
    </div>
  );
};

const MySlider = () => (
  <ConfigProvider
    theme={{
      components: {
        Slider: {
          handleActiveColor: "#1DB48D",
          trackBg: "#1DB48D",
          trackHoverBg: "#1DB48D",
          handleColor: "#1DB48D",
          colorPrimaryBorderHover: "#1DB48D",
        },
      },
    }}
  >
    <IntegerStep />
  </ConfigProvider>
);

export default MySlider;
