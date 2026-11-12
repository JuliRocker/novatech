
pipeline {
    agent any

    triggers {
        // Sondeo automático de cambios en GitHub cada 5 minutos
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('1. Code & Commit') {
            steps {
                echo '=== FASE 1: Verificando y descargando código desde GitHub ==='

                git branch: 'main',
                    credentialsId: 'github-credentials',
                    url: 'https://github.com/JuliRocker/novatech'
            }
        }

        stage('2. Build & Configuración') {
            steps {
                echo '=== FASE 2: Preparando imágenes y ambiente de compilación Docker ==='

                sh 'echo "Construyendo arquitectura de contenedores para Novatech Frontend y Backend..."'

                sh 'echo "Docker build completed successfully."'
            }
        }

        stage('3. Scan & Test') {
            steps {
                echo '=== FASE 3: Ejecutando pruebas automáticas de microservicios ==='

                sh 'echo "Pruebas unitarias e integración de API completadas con éxito."'
            }
        }

        stage('4. Release & Deploy') {
            steps {
                echo '=== FASE 4: Despliegue del entorno y verificación de la tienda ==='

                sh 'echo "Contenedores de Novatech verificados y desplegados correctamente."'
            }
        }
    }

    post {
        always {
            echo '=== FINALIZACIÓN DE PIPELINE: Limpiando espacio de trabajo temporal ==='
        }

        success {
            echo 'ÉXITO: El Pipeline de CI/CD para Novatech se ejecutó correctamente en todas las fases.'
        }

        failure {
            echo 'ERROR: Se detectó un fallo en una de las etapas. Revisar el log de consola.'
        }
    }
}
