//package com.example.humorme.config
//
//import jakarta.servlet.*
//import jakarta.servlet.Filter
//import org.springframework.stereotype.Component
//
//@Component
//class CorsFilter : Filter {
//
//    //    @Throws(IOException::class, ServletException::class)
////    override fun doFilter(req: ServletRequest, res: ServletResponse, chain: FilterChain) {
////        val request = req as HttpServletRequest
////        val response = res as HttpServletResponse
////        response.setHeader("Access-Control-Allow-Origin", "*") //request.getHeader("Origin")
////        response.setHeader("Access-Control-Allow-Credentials", "true")
////        response.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET, PUT, PATCH, DELETE")
////        response.setHeader("Access-Control-Max-Age", "3600")
////        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With, remember-me")
////        chain.doFilter(req, res)
////    }
//    override fun doFilter(request: ServletRequest?, response: ServletResponse?, chain: FilterChain?) {
//        //TODO("Not yet implemented")
//    }
//}