import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/index";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import store from "./redux/store";

const defaultData = {
  borderRadius: 6,
  colorPrimary: "#163C94",
  algorithm: "lighten",
  Button: {
    colorPrimary: "#163C94",
  },
  Input: {
    colorPrimary: "#163C94",
  },
  Descriptions: {
    borderRadius: "0px",
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: defaultData.colorPrimary,
            borderRadius: defaultData.borderRadius,
          },
          components: {
            Button: {
              colorPrimary: defaultData.Button?.colorPrimary,
              boxShadow: "none",
              primaryShadow: "none",
              boxShadowSecondary: "none",
            },
            Input: {
              colorPrimary: defaultData.Input?.colorPrimary,
              algorithm: defaultData.Input?.algorithm,
            },
            Select: {
              colorPrimary: defaultData.Select?.colorPrimary,
              algorithm: defaultData.Select?.algorithm,
            },
            InputNumber: {
              colorPrimary: defaultData.InputNumber?.colorPrimary,
              algorithm: defaultData.InputNumber?.algorithm,
            },
            DatePicker: {
              colorPrimary: defaultData.colorPrimary,
              algorithm: defaultData.algorithm,
              cellActiveWithRangeBg: defaultData.colorPrimary,
            },
            Descriptions: {
              borderRadius: 0,
            },
            Checkbox: {
              colorPrimary: defaultData.colorPrimary,
              algorithm: defaultData.algorithm,
              colorBorder: defaultData.colorPrimary,
              colorBgContainerDisabled: "#f5f5f5",
            },
          },
        }}
      >
        <RouterProvider router={routes} />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
