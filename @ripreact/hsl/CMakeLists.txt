cmake_minimum_required(VERSION 3.15)
set(CMAKE_C_STANDARD 11)

if(NOT CMAKE_BUILD_TYPE)
  set(CMAKE_BUILD_TYPE Release)
endif()

project(hsl)
include_directories(${CMAKE_JS_INC})
file(GLOB SOURCE_FILES "./src/index.c")
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})
add_definitions(-DNAPI_VERSION=3)

set(CMAKE_C_FLAGS_RELEASE "-ffast-math ${CMAKE_C_FLAGS_RELEASE}")

message(STATUS "SDFHSGHFSDGSFG")
message(STATUS "${CMAKE_JS_INC}")
