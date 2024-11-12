import React from "react";
import { IoMdHome } from "react-icons/io";
import { CgMenuGridR } from "react-icons/cg";
import { TiShoppingBag } from "react-icons/ti";
import { IoPeopleSharp } from "react-icons/io5";
import { GoBookmark } from "react-icons/go";
import { FaRegMessage } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import contacts from "../constant/data";
import Image from "next/image";
const Sidebar = () => {
  return (
    <div class="fixed left-0  h-full overflow-y-auto flex w-[20%]  flex-col  bg-clip-border p-4 text-gray-700 ">
      <nav class="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
        <div
          role="button"
          class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 hover:bg-slate-200"
        >
          <div class="grid mr-4 place-items-center">
            <IoMdHome size={20} />
          </div>
          Feed
        </div>
        <div
          role="button"
          class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 hover:bg-slate-200"
        >
          <div class="grid mr-4 place-items-center">
            <CgMenuGridR size={20} />
          </div>
          Explore
        </div>
        <div
          role="button"
          class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 hover:bg-slate-200"
        >
          <div class="grid mr-4 place-items-center">
            <TiShoppingBag size={20} />
          </div>
          MarketPlace
          <div class="grid ml-auto place-items-center justify-self-end">
            <div class="relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-full select-none whitespace-nowrap bg-blue-gray-500/20 text-blue-gray-900 hover:bg-slate-200"></div>
          </div>
        </div>
        <div
          role="button"
          class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 hover:bg-slate-200"
        >
          <div class="grid mr-4 place-items-center">
            <IoPeopleSharp size={20} />
          </div>
          Groups
        </div>
        <div
          role="button"
          class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 hover:bg-slate-200"
        >
          <div class="grid mr-4 place-items-center">
            <GoBookmark size={20} />
          </div>
          My Favourite
        </div>
        <div
          role="button"
          class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 hover:bg-slate-200"
        >
          <div class="grid mr-4 place-items-center">
            <FaRegMessage size={20} />
          </div>
          Messages
        </div>
        <div
          role="button"
          class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 hover:bg-slate-200"
        >
          <div class="grid mr-4 place-items-center">
            <IoSettingsOutline size={20} />
          </div>
          Settings
        </div>
      </nav>
      {/************************************  My contact section********************* */}

      <div className="p-4 min-w-[240px] ">
        <h2 className="text-lg font-bold mb-4">My Contacts</h2>
        <ul>
          {contacts.map((contact, index) => (
            <li
              key={index}
              className="flex items-center mb-4 p-2 rounded-md hover:bg-gray-100 transition"
            >
              <Image
                width={40}
                height={40}
                src={contact.image}
                alt={contact.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.location}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
