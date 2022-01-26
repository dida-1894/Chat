import React from 'react';
import ReactDOM from 'react-dom';
import { Chart } from './component/chat';
import "antd/dist/antd.css";

ReactDOM.render(
    <Chart />,
  document.getElementById('app')
);
module.hot.accept();
