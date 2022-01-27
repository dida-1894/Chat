import React from 'react'
import { USER_CUSTOM, USER_SERVICE } from './constant'
import { Chart } from './component/chat'
import { EditorContextProvider } from './component/context/editor-context'
import { UserContextProvider } from './component/context/user-context'
import { ServiceChart } from './component/chat/service-chart'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const ServiceApp = () => {
    return (
        <UserContextProvider userType={USER_SERVICE}>
            <EditorContextProvider>
                <ServiceChart />
            </EditorContextProvider>
        </UserContextProvider>
    )
}
const CustomApp = () => {
    return (
        <UserContextProvider userType={USER_CUSTOM}>
            <EditorContextProvider>
                <Chart />
            </EditorContextProvider>
        </UserContextProvider>
    )
}

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<CustomApp />} />
                <Route path="/service" element={<ServiceApp />} />
            </Routes>
        </BrowserRouter>
    )
}