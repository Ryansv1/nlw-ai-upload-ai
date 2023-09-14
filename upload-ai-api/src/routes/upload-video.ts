import { FastifyInstance } from "fastify";
import { fastifyMultipart } from '@fastify/multipart'
import { prisma } from '../lib/prisma'
import path from 'node:path'
import { randomUUID } from "node:crypto";
import  fs from 'node:fs'
import { pipeline } from "node:stream";
import { promisify } from "node:util";

const pump = promisify(pipeline);

export async function uploadVideoRoute(app: FastifyInstance){

    app.register(fastifyMultipart, {
        //Configurçoes
        limits: {
            fileSize: 1048576 * 40, // 40MB
        },
    });
    app.post("/videos", async (request, reply) => {
        const data = await request.file(); // Pega o arquivo enviado pelo cliente
        if(!data){
            return reply.status(400).send({error: "No file uploaded"}); // Checa se o arquivo foi enviado realmente, ou se é uma requisição vazia
        }

        const extension = path.extname(data.filename); // Pega a extensão do arquivo

        if(extension !== '.mp3'){
            return reply.status(400).send({error: "Invalid file type"}); // Checa se o arquivo é um mp3
        }
        
        const fileBaseName = path.basename(data.filename, extension); // Nome original do Arquivo
        const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}` // Nome do arquivo no servidor após troca

        const uploadDestination = path.resolve(__dirname, '../../temp', fileUploadName); // Caminho do arquivo no servidor, onde o mesmo vai ser salvo

        await pump(data.file, fs.createWriteStream(uploadDestination)); // Salva o arquivo no servidor

        const video = await prisma.video.create({
            data:{
                name: data.filename,
                path: uploadDestination,
            }
        }) // Salva o arquivo no banco de dados
        return {video} // Retorna o arquivo salvo no banco de dados
    });
}