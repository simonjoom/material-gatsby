#!/bin/bash
# deep copy script
export NOYARNPOSTINSTALL="yes"

# cp -Rf ./packhack/react-native-vector-icons ./node_modules/
cp -Rf ./packhack/@reach ./node_modules/
# cp -Rf ./packhack/react-dev-utils ./node_modules/
# cp -Rf ./packhack/react-native-web ./node_modules/
cp -Rf ./packhack/gatsby ./node_modules/
cp -Rf ./packhack/gatsby-plugin-sass ./node_modules/ 
cp -Rf ./packhack/htmltojsx ./node_modules/ 
cp -Rf ./packhack/gatsby-image ./node_modules/ 
# cp -Rf ./packhack/gatsby-plugin-page-creator ./node_modules/ 
# cp -Rf ./packhack/gatsby-react-router-scroll ./node_modules/ 