import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import { pluginSass } from '@rsbuild/plugin-sass';

export default defineConfig({
    plugins: [
        pluginReact(), 
        pluginSvgr({ mixedImport: true }),
        pluginSass()
    ],
    output: {
        distPath: {
        root: 'build',
        },
    },
    html: {
        template: './public/index.html',
        favicon: './public/favicon.svg'
    }
});