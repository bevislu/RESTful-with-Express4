# RESTful-with-Express4
A sample of RESTful API powered by Express4, also including socket.io, cluster and sticky-session

Also, in this sample, we use MongoDB to store the data of sample.

Original idea comes from https://www.sitepoint.com/creating-restful-apis-express-4/

Because I am learning WebSocket, nodejs cluster and sticky-session as well, so I put all those things together.

In order to make this app run up, MongoDB should be installed first.

I change the port of MongoDB from 27017 to 27018.

And in order to be able to broadcast messages between different node workers, Redis is also needed here.
