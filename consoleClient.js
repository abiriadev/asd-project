#!/usr/bin/env node
const net = require('net');
const ora = require('ora');

let spinner = ora('connecting...');

const connect = () => {
    return net
        .createConnection(
            {
                port: 51944,
            },
            () => {
                console.log('connect to server!');
            },
        )
        .on('error', err => {
            // console.log('connecting... error');
            spinner.fail('fail');

            setTimeout(() => {
                // spinner
                client = connect();
            }, 4000);
        })
        .on('connect', () => {
            spinner.succeed('succed');
        })
        .on('data', data => {
            console.log(data.toString());
        });
};

let client = null;

client = connect();

spinner.start();
