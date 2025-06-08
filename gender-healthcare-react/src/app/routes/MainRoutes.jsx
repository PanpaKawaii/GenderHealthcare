import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Blog from '../pages/blog/Blog'

export default function MainRoutes() {
    return (
        <BrowserRouter>
            <></>
            <Routes>
                <Route path='/' element={<></>} />
                <Route path='*' element={<></>} />
                <Route path='/blog' element= {<Blog/>}/>
            </Routes>
            <></>
        </BrowserRouter>
    )
}
