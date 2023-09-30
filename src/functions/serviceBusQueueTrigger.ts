import { app, InvocationContext } from "@azure/functions";
import { readFileSync  , unlinkSync} from "node:fs";
import {FilesManager} from 'turbodepot-node';

export async function serviceBusQueueTrigger(message: unknown, context: InvocationContext): Promise<void> {
    // createReceiver() can also be used to create a receiver for a subscription.
    try{
        
        context.log('Message:', message);
        context.log('EnqueuedTimeUtc =', context.triggerMetadata.enqueuedTimeUtc);
        context.log('DeliveryCount =', context.triggerMetadata.deliveryCount);
        context.log('MessageId =', context.triggerMetadata.messageId);

        if(typeof message === "string" && message === "Rosina.Luettgen76"){
            throw new Error("user is not authorized");
        }

        // const filesManager = new FilesManager();

        // readFile(context, filesManager);

    }catch(error){
      context.error('serviceBusQueueTrigger',error?.message);
      throw new Error(error);
    }
}


const readFile = (context:InvocationContext , filesManager:FilesManager)=>{
    try{
        const outputPath = `C:\\home\\result-${context.invocationId}.txt`;
        let inputPathList = [];

         for(let i = 0;i < 7000 ;i++){
            inputPathList.push( 'sample_file.txt');
         }

         filesManager.mergeFiles(inputPathList,outputPath);

         inputPathList = [];

         for(let i = 0;i < 7000 ;i++){
            inputPathList.push( 'sample_file.txt');
         }

         filesManager.mergeFiles(inputPathList,outputPath);
         

        for(let i=0; i< 10 ;i++){
            const memoryData = process.memoryUsage();
            const formatMemoryUsage = (data:any) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;
        
            const memoryUsage = {
            rss: `${formatMemoryUsage( memoryData.rss )} -> Resident Set Size - total memory allocated for the process execution`,
            heapTotal: `${formatMemoryUsage( memoryData.heapTotal )} -> total size of the allocated heap`,
            heapUsed: `${formatMemoryUsage( memoryData.heapUsed )} -> actual memory used during the execution`,
            external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
            };
            readFileSync(outputPath, 'utf-8');
            
            context.log(memoryUsage);
            
        }
        unlinkSync(outputPath);
    }catch(error){
        context.error(error);
        throw new Error(error);
    }
}

app.serviceBusQueue('serviceBusQueueTrigger', {
    connection: 'azureservicebusvm_SERVICEBUS',
    queueName: 'binder-jobs',
    handler: serviceBusQueueTrigger
});
