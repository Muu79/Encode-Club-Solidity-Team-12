'use client'
import { CardProps, InputFieldProps, PrimaryBtnProps } from "./componentPropsTypes/componentTypes";
import { useState } from "react";
import { ethers } from "ethers";
import React from "react";


export const Card = ({ children, className }: CardProps) => (
  <div className={`${className ? className + " " : ""}flex flex-col items-center mt-8 mx-5 max-w-m p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700`}>
    {children}
  </div>
);

export const PrimaryBtn = ({ onClick, name, className }: PrimaryBtnProps) => (
  <button onClick={onClick} className="relative inline-flex items-center justify-center p-0.5 mt-5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
    <span className={`${className ? className + " " : ""}relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0`}>
      {name}
    </span>
  </button>
);

export const InputField = ({ inputType, placeholder, onChange, className }: InputFieldProps) => (
  <div className="w-1/2">
    <input
      type={inputType}
      className={`${className ? className + " " : ""}`+"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mt-3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"}
      placeholder={placeholder}
      onChange={onChange}
      required
    />
  </div>
);

