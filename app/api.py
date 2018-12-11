from flask import jsonify, request, Blueprint
from requests import get


MAX_CALLS = 30
BASE_URL = 'https://www.themuse.com/api/public/'

bp = Blueprint('blueprint', __name__)


@bp.route('/load', methods=['GET'])
def get_companies():
    all_companies = []
    for i in range(MAX_CALLS):
        r = get(f'{BASE_URL}companies', params={'page': i})
        data = r.json()
        all_companies.extend(data.get('results'))
        if data.get('page_count') == i:
            break
    industries, locations = format_data(all_companies)
    return jsonify({'company_industries': industries, 'company_locations': locations}), 200


@bp.route('/', defaults={'path': ''})
@bp.route('/<path:path>')
def proxy(path):
    path = path.strip('/')
    r = get(f'{BASE_URL}{path}', params=request.args)
    # return jsonify(r.json()['results']), 200
    return jsonify(r.json()), 200


def format_data(companies):
    all_locations = set()
    all_industries = set()

    for company in companies:
        locations = list(map(lambda x: x.get('name'), company.get('locations')))
        industries = list(map(lambda x: x.get('name'), company.get('industries')))

        all_locations.update(locations)
        all_industries.update(industries)

    return list(all_industries), list(all_locations)
