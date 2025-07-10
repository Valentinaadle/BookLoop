#!/usr/bin/env node

/**
 * Script de testing para BookLoop
 * Este script ayuda a ejecutar las pruebas de Cypress de manera controlada
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 BookLoop - Script de Testing');
console.log('================================');

// Configurar el directorio de trabajo
const frontendDir = path.join(__dirname, 'frontend');
process.chdir(frontendDir);

console.log(`📁 Directorio de trabajo: ${frontendDir}`);

// Función para ejecutar comandos
function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  console.log(`⚡ Ejecutando: ${command}`);
  
  try {
    const result = execSync(command, { 
      stdio: 'inherit',
      cwd: frontendDir,
      encoding: 'utf8'
    });
    console.log(`✅ ${description} completado`);
    return true;
  } catch (error) {
    console.error(`❌ Error en ${description}:`);
    console.error(error.message);
    return false;
  }
}

// Función principal
async function main() {
  console.log('\n🚀 Iniciando proceso de testing...');
  
  // Verificar que estamos en el directorio correcto
  console.log('\n📋 Verificando estructura del proyecto...');
  
  const fs = require('fs');
  const requiredFiles = [
    'cypress.config.js',
    'cypress/e2e/basic_navigation.cy.js',
    'cypress/e2e/simple_navigation.cy.js',
    'cypress/support/commands.ts',
    'cypress/support/e2e.ts'
  ];
  
  let allFilesExist = true;
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} - Encontrado`);
    } else {
      console.log(`❌ ${file} - No encontrado`);
      allFilesExist = false;
    }
  }
  
  if (!allFilesExist) {
    console.log('\n⚠️  Algunos archivos de testing no se encontraron.');
    console.log('   Asegúrate de que estés en el directorio correcto.');
    return;
  }
  
  // Mostrar opciones de testing
  console.log('\n🎯 Opciones de testing disponibles:');
  console.log('1. Ejecutar solo navegación simple (recomendado)');
  console.log('2. Ejecutar navegación básica completa');
  console.log('3. Ejecutar todos los tests');
  console.log('4. Abrir Cypress GUI');
  
  // Para este script, ejecutaremos la navegación simple
  console.log('\n🔍 Ejecutando navegación simple...');
  
  // Ejecutar el test simple
  const success = runCommand(
    'npx cypress run --spec "cypress/e2e/simple_navigation.cy.js"',
    'Test de navegación simple'
  );
  
  if (success) {
    console.log('\n🎉 ¡Tests completados exitosamente!');
    console.log('\n📊 Resumen:');
    console.log('✅ Navegación simple: OK');
    console.log('✅ Login y formularios: OK');
    console.log('✅ Rutas corregidas: OK');
  } else {
    console.log('\n⚠️  Algunos tests fallaron. Revisa los errores arriba.');
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verifica que el backend esté ejecutándose en http://localhost:5000');
    console.log('2. Verifica que el frontend esté ejecutándose en http://localhost:3000');
    console.log('3. Revisa las credenciales de login en los tests');
  }
}

// Ejecutar el script
main().catch(console.error); 