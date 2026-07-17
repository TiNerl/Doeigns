import { BadRequestException, Injectable } from '@nestjs/common';
import { StatusCampanha } from '@prisma/client';

const TRANSICOES_VALIDAS: Record<StatusCampanha, StatusCampanha[]> = {
  ABERTA: [StatusCampanha.EM_ANDAMENTO, StatusCampanha.CANCELADA],
  EM_ANDAMENTO: [StatusCampanha.CONCLUIDA, StatusCampanha.CANCELADA],
  CONCLUIDA: [],
  CANCELADA: [],
};

@Injectable()
export class CampanhaStateService {
  validarTransicao(atual: StatusCampanha, novo: StatusCampanha) {
    const permitidas = TRANSICOES_VALIDAS[atual] ?? [];
    if (!permitidas.includes(novo)) {
      throw new BadRequestException(
        `Transição de status inválida: ${atual} → ${novo}`,
      );
    }
  }
}
