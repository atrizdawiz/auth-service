pipeline {
    agent { dockerfile true }
    stages {
        stage('Test') {
            steps {
              step([$class: 'DockerComposeBuilder', dockerComposeFile: 'docker-compose.yml', option: [$class: 'ExecuteCommandInsideContainer', command: '--env-file .env.prod up', index: 1, privilegedMode: false, service: 'auth-service', workDir: ''], useCustomDockerComposeFile: true])
            }
        }
    }
}