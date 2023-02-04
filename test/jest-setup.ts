import { SetupServer } from "@src/server";
import supertest from "supertest";

beforeAll(() => {

   //run before all tests
   //setup server

   const server = new SetupServer();
   server.init();

   //setup global variable to be used in tests
   global.testRequest = supertest(server.getApp());

});